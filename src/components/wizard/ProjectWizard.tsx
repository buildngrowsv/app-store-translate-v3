import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { openaiService } from '../../services/openai';
import { SubscriptionService } from '../../services/subscription';
import { StepIndicator } from './StepIndicator';
import { ProjectDetails } from './ProjectDetails';
import { ProjectType } from './ProjectType';
import { LanguageSelection } from './LanguageSelection';
import { Button } from '../Button';
import { FirebaseService } from '../../services/firebase';
import { AlertCircle } from 'lucide-react';

type WizardStep = 'details' | 'type' | 'languages';

export const ProjectWizard: React.FC = () => {
  const navigate = useNavigate();
  const { user, userData, createProject } = useAuth();
  const [step, setStep] = useState<WizardStep>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    keywords: '',
    type: '' as 'enhance' | 'translate' | '',
    languages: [] as string[],
  });

  const handleCreateAndProcess = async () => {
    if (!projectData.type || !user) {
      console.error('Project type is required');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Check project creation limits
      const projectCount = userData?.projects?.length || 0;
      const canCreate = await SubscriptionService.canCreateProject(user.uid, projectCount);
      
      if (!canCreate.allowed) {
        setError(canCreate.reason || 'Cannot create more projects on your current plan');
        setIsProcessing(false);
        return;
      }

      // Check language limits for translation projects
      if (projectData.type === 'translate') {
        const canSelectLanguages = await SubscriptionService.canSelectLanguages(
          user.uid,
          projectData.languages.length
        );

        if (!canSelectLanguages.allowed) {
          setError(canSelectLanguages.reason || 'Cannot select more languages on your current plan');
          setIsProcessing(false);
          return;
        }
      }
      
      // Create the project first with in-progress status
      const projectId = await createProject({
        ...projectData,
        languages: projectData.type === 'enhance' ? [] : projectData.languages,
        results: {
          status: 'in-progress'
        }
      });

      // Navigate to dashboard immediately
      navigate('/dashboard');

      // Continue processing in the background
      try {
        const results = await openaiService.processProject({
          ...projectData,
          type: projectData.type as 'enhance' | 'translate',
          id: projectId,
          languages: projectData.type === 'enhance' ? [] : projectData.languages,
          lastUpdated: new Date().toISOString()
        });

        // Update project with results
        await FirebaseService.updateProject(projectId, {
          results: {
            status: 'completed',
            data: results.data
          }
        });
      } catch (error) {
        console.error('Failed to process project:', error);
        // Update project with error status
        await FirebaseService.updateProject(projectId, {
          results: {
            status: 'error',
            error: 'Failed to process project'
          }
        });
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      setError('Failed to create project. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleNext = async () => {
    switch (step) {
      case 'details':
        setStep('type');
        break;
      case 'type':
        if (projectData.type === 'enhance') {
          await handleCreateAndProcess();
        } else {
          setStep('languages');
        }
        break;
      case 'languages':
        await handleCreateAndProcess();
        break;
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'type':
        setStep('details');
        break;
      case 'languages':
        setStep('type');
        break;
    }
  };

  const currentStepIndex = ['details', 'type', 'languages'].indexOf(step);
  const totalSteps = projectData.type === 'enhance' ? 2 : 3;
  const steps = ['Project Details', 'Enhancement Type', 'Languages'].slice(0, totalSteps);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <StepIndicator 
          steps={steps} 
          currentStep={currentStepIndex} 
        />

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Subscription Limit Reached</p>
              <p className="mt-1">{error}</p>
              <a 
                href="/settings#subscription" 
                className="mt-2 inline-block text-red-700 hover:text-red-800 underline"
              >
                Upgrade your plan
              </a>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {step === 'details' && (
            <ProjectDetails
              data={projectData}
              onChange={(data) => setProjectData({ ...projectData, ...data })}
            />
          )}
          {step === 'type' && (
            <ProjectType
              selected={projectData.type}
              onSelect={(type) => setProjectData({ ...projectData, type })}
            />
          )}
          {step === 'languages' && projectData.type === 'translate' && (
            <LanguageSelection
              selected={projectData.languages}
              onChange={(languages) => setProjectData({ ...projectData, languages })}
            />
          )}
        </div>

        <div className="flex justify-between">
          {step !== 'details' && (
            <Button variant="outline" onClick={handleBack} disabled={isProcessing}>
              Back
            </Button>
          )}
          <Button
            className={step === 'details' ? 'ml-auto' : ''}
            onClick={handleNext}
            disabled={
              isProcessing ||
              (step === 'details' && !projectData.name) ||
              (step === 'type' && !projectData.type) ||
              (step === 'languages' && projectData.languages.length === 0)
            }
          >
            {isProcessing ? 'Processing...' : 
              step === 'languages' || (step === 'type' && projectData.type === 'enhance')
                ? 'Create Project'
                : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};
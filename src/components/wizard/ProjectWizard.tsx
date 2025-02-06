import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { StepIndicator } from './StepIndicator';
import { ProjectDetails } from './ProjectDetails';
import { ProjectType } from './ProjectType';
import { LanguageSelection } from './LanguageSelection';
import { Button } from '../Button';

type WizardStep = 'details' | 'type' | 'languages';

export const ProjectWizard: React.FC = () => {
  const navigate = useNavigate();
  const { createProject } = useAuth();
  const [step, setStep] = useState<WizardStep>('details');
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    keywords: '',
    type: '' as 'enhance' | 'translate' | '',
    languages: [] as string[],
  });

  const handleNext = async () => {
    switch (step) {
      case 'details':
        setStep('type');
        break;
      case 'type':
        if (projectData.type === 'enhance') {
          // Create project and go to dashboard
          try {
            await createProject({
              ...projectData,
              languages: []
            });
            navigate('/dashboard');
          } catch (error) {
            console.error('Failed to create project:', error);
          }
        } else {
          setStep('languages');
        }
        break;
      case 'languages':
        try {
          await createProject(projectData);
          navigate('/dashboard');
        } catch (error) {
          console.error('Failed to create project:', error);
        }
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
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <Button
            className={step === 'details' ? 'ml-auto' : ''}
            onClick={handleNext}
            disabled={
              (step === 'details' && !projectData.name) ||
              (step === 'type' && !projectData.type) ||
              (step === 'languages' && projectData.languages.length === 0)
            }
          >
            {step === 'languages' || (step === 'type' && projectData.type === 'enhance')
              ? 'Create Project'
              : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};
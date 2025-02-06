import { useAnalytics } from './useAnalytics';

interface ContentType {
  title: string;
  description: string;
  keywords?: string[];
}

interface ProjectCompletionParams {
  projectId: string;
  projectType: 'translation' | 'enhancement';
  startTime: number;
  sourceLanguage?: string;
  targetLanguages?: string[];
  originalContent: ContentType;
  improvedContent: ContentType;
}

export function useProjectCompletion() {
  const {
    trackTranslationComplete,
    trackASOComplete,
    trackContentImprovement,
    trackError
  } = useAnalytics();

  const handleProjectCompletion = async (params: ProjectCompletionParams) => {
    const processingTimeMs = Date.now() - params.startTime;
    
    try {
      // Track individual content improvements first
      (['title', 'description'] as const).forEach((type) => {
        trackContentImprovement({
          type,
          language: params.projectType === 'translation' ? params.targetLanguages![0] : params.sourceLanguage!,
          originalLength: params.originalContent[type].length,
          improvedLength: params.improvedContent[type].length,
          projectId: params.projectId,
          success: true,
          improvementType: params.projectType
        });
      });

      // Track overall project completion
      if (params.projectType === 'translation') {
        trackTranslationComplete({
          sourceLanguage: params.sourceLanguage!,
          targetLanguages: params.targetLanguages!,
          characterCount: params.improvedContent.description.length + params.improvedContent.title.length,
          processingTimeMs,
          projectId: params.projectId,
          success: true
        });
      } else {
        // ASO Enhancement
        trackASOComplete({
          language: params.sourceLanguage!,
          originalLength: params.originalContent.description.length + params.originalContent.title.length,
          enhancedLength: params.improvedContent.description.length + params.improvedContent.title.length,
          keywordsUsed: params.improvedContent.keywords || [],
          projectId: params.projectId,
          success: true,
          improvementAreas: getImprovementAreas(params.originalContent, params.improvedContent)
        });
      }

      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        trackError(
          'project_completion_error',
          error.message,
          'useProjectCompletion'
        );
      } else {
        trackError(
          'project_completion_error',
          'Unknown error occurred',
          'useProjectCompletion'
        );
      }
      return false;
    }
  };

  return {
    handleProjectCompletion
  };
}

// Helper function to analyze improvements
function getImprovementAreas(original: ContentType, improved: ContentType): string[] {
  const improvements: string[] = [];

  if (improved.title.length !== original.title.length) {
    improvements.push('title_length');
  }
  if (improved.description.length !== original.description.length) {
    improvements.push('description_length');
  }
  if (improved.keywords?.length !== original.keywords?.length) {
    improvements.push('keywords_count');
  }

  // Add more sophisticated improvement detection here
  // For example, keyword density, readability scores, etc.

  return improvements;
} 
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';


export default function CustomStepper({ steps, stepComponents, formAction }: { steps: {stepLabel: string, isCompleted: boolean}[], stepComponents: React.ReactNode[], formAction: () => void}) {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((stepInfo) => {
          const stepProps: { completed?: boolean } = { completed: stepInfo.isCompleted};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};

          return (
            <Step key={stepInfo.stepLabel} {...stepProps}>
              <StepLabel sx={{
                      '& .MuiStepIcon-root': {
                        color: 'primary.dark', // circle color ()
                      },
                      '& .MuiStepIcon-root.Mui-active':
                        {
                          color: 'primary.light', // circle color (ACTIVE)
                        },
                      '& .MuiStepIcon-root.Mui-completed': {
                        color: 'primary.dark', // circle color (COMPLETED)
                      }
                  }}
                      {...labelProps}>{stepInfo.stepLabel}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
        <React.Fragment>
          {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography> */}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
              {!steps[activeStep].isCompleted && activeStep !== 2?
              // <Tooltip 
              //   title={activeStep === 0 ? 'You have to select a movie to continue to the nest step' 
              //         : activeStep === 1 ? 'Invite Friends to continue to the nest step': null} 
              //   arrow
              // >
                <Button disabled={true} sx={{backgroundColor: 'primary.dark', '&:hover': { backgroundColor: 'primary.light'}}}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button> 
              // </Tooltip>
              : <Button onClick={activeStep === steps.length - 1 ? () => formAction() : handleNext} sx={{backgroundColor: 'primary.dark', '&:hover': { backgroundColor: 'primary.light'}}}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button> 
              }
            </Box>
        </React.Fragment>
      <Box sx={{padding: '16px'}}>
        {stepComponents[activeStep]}
      </Box>
    </Box>
  );
}
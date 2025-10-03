import { SystemField } from './types';

export const buomHubFields: SystemField[] = [
  // BUOM Hub Page - Welcome Card
  {
    sfmId: "SFM-HUB-9001-1",
    description: "Welcome Message Display",
    pageName: "BUOM Hub",
    cardName: "Welcome Card",
    outputValue: "welcomeMessage",
    correlatedTo: "User onboarding and introduction",
    valueType: "Display"
  },
  {
    sfmId: "SFM-HUB-9002-1", 
    description: "AI Video Intro Status",
    pageName: "BUOM Hub",
    cardName: "Welcome Card",
    outputValue: "aiVideoIntroStatus",
    correlatedTo: "Video introduction availability",
    valueType: "Status"
  },

  // BUOM Hub Page - User Guide Card
  {
    sfmId: "SFM-HUB-9003-1",
    description: "User Guide Content",
    pageName: "BUOM Hub",
    cardName: "User Guide Card",
    outputValue: "userGuideContent",
    correlatedTo: "Help documentation and guidance",
    valueType: "Display"
  },
  {
    sfmId: "SFM-HUB-9004-1",
    description: "User Guide Hyperlinks",
    pageName: "BUOM Hub",
    cardName: "User Guide Card", 
    outputValue: "userGuideLinks",
    correlatedTo: "Navigation links to help sections",
    valueType: "Navigation"
  },

  // BUOM Hub Page - Next Steps Card
  {
    sfmId: "SFM-HUB-9005-1",
    description: "Next Steps Content",
    pageName: "BUOM Hub",
    cardName: "Next Steps Card",
    outputValue: "nextStepsContent",
    correlatedTo: "Recommended actions for user",
    valueType: "Display"
  },

  // BUOM Hub Page - To Do List Card
  {
    sfmId: "SFM-HUB-9010-1",
    description: "Current Workplace Status Completion",
    pageName: "BUOM Hub",
    cardName: "To Do List Card",
    outputValue: "workplaceStatusComplete",
    correlatedTo: "Profile > Salary Details completion status",
    valueType: "Status"
  },
  {
    sfmId: "SFM-HUB-9011-1",
    description: "Current Pension Provider Status",
    pageName: "BUOM Hub", 
    cardName: "To Do List Card",
    outputValue: "pensionProviderComplete",
    correlatedTo: "Profile > Pension Details completion status",
    valueType: "Status"
  },
  {
    sfmId: "SFM-HUB-9012-1",
    description: "Latest Payslip Upload Status",
    pageName: "BUOM Hub",
    cardName: "To Do List Card",
    outputValue: "payslipUploadComplete",
    correlatedTo: "Profile > Documents completion status",
    valueType: "Status"
  },
  {
    sfmId: "SFM-HUB-9013-1",
    description: "Past Pension Details Status",
    pageName: "BUOM Hub",
    cardName: "To Do List Card",
    outputValue: "pastPensionComplete",
    correlatedTo: "Net Asset Value > Assets > Pensions completion status",
    valueType: "Status"
  },
  {
    sfmId: "SFM-HUB-9014-1",
    description: "Assets and Liabilities Update Status",
    pageName: "BUOM Hub",
    cardName: "To Do List Card",
    outputValue: "assetsLiabilitiesComplete",
    correlatedTo: "Net Asset Value completion status",
    valueType: "Status"
  },
  {
    sfmId: "SFM-HUB-9015-1",
    description: "Legacy & Estate Planning Status",
    pageName: "BUOM Hub",
    cardName: "To Do List Card",
    outputValue: "legacyPlanningComplete",
    correlatedTo: "Profile > Legacy Planning completion status",
    valueType: "Status"
  },
  {
    sfmId: "SFM-HUB-9016-1",
    description: "Professional Advisors Status",
    pageName: "BUOM Hub",
    cardName: "To Do List Card",
    outputValue: "professionalAdvisorsComplete",
    correlatedTo: "Profile > Professional Advisors completion status",
    valueType: "Status"
  },

  // BUOM Hub Page - Progress Tracking
  {
    sfmId: "SFM-HUB-9020-1",
    description: "Overall Completion Percentage",
    pageName: "BUOM Hub",
    cardName: "To Do List Card",
    outputValue: "overallCompletionPercentage",
    correlatedTo: "Total completion status across all sections",
    valueType: "Percentage"
  },
  {
    sfmId: "SFM-HUB-9021-1",
    description: "Next Priority Action",
    pageName: "BUOM Hub",
    cardName: "To Do List Card",
    outputValue: "nextPriorityAction",
    correlatedTo: "Recommended next step for user",
    valueType: "Action"
  }
];
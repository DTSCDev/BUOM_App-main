
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ImportantNoticeDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto text-blue-600 underline text-sm">
          Important Notice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Important Notice</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p>
            This retirement planning tool is provided for informational purposes only and should not be considered as financial advice. 
            The calculations and projections shown are based on assumptions and may not reflect actual future performance.
          </p>
          <p>
            Past performance is not indicative of future results. Investment values can go down as well as up, and you may get back less than you invested.
          </p>
          <p>
            Before making any financial decisions, we strongly recommend that you consult with a qualified financial advisor who can assess your individual circumstances and provide personalized advice.
          </p>
          <p>
            The Advanced Pension Funding (APF) and ISA calculations are estimates based on current regulations and assumptions about future market conditions, inflation rates, and tax policies, which may change.
          </p>
          <p>
            BUOM is not responsible for any financial decisions made based on the information provided by this tool.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

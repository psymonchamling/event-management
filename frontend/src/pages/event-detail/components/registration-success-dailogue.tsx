import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";

type RegistrationSuccessDialoguePropsType = {
  showSuccessDialog: boolean;
  setShowSuccessDialog: Dispatch<SetStateAction<boolean>>;
};

const RegistrationSuccessDialogue = ({
  showSuccessDialog,
  setShowSuccessDialog,
}: RegistrationSuccessDialoguePropsType) => {
  return (
    <>
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30">
              <CheckCircle2 className="h-12 w-12 animate-in zoom-in duration-300" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-foreground">
                Registration Successful!
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                You have successfully registered for this event.
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <button
              onClick={() => setShowSuccessDialog(false)}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition"
            >
              Close
            </button>
            <Link
              to="/dashboard/my-registration"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
            >
              View My Registrations
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegistrationSuccessDialogue;

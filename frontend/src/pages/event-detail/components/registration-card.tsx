import { useAuth } from "@/context/auth-context/auth-context";
import authAxios from "@/services/authAxios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { AxiosError } from "axios";

type RegistrationCardPropsType = {
  userId: string;
  eventId: string;
  eventPrice: number;
  eventCapacity: number;
  isCurrentUser: boolean;
};

const RegistrationCard = ({
  userId,
  eventId,
  eventPrice,
  eventCapacity,
  isCurrentUser,
}: RegistrationCardPropsType) => {
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();

  let isRegistered: boolean = false;

  //Registration check
  const { data: newData } = useQuery({
    queryFn: async () => {
      const res = await authAxios(
        `/api/registration/status?userId=${userId}&eventId=${eventId}`
      );
      return res.data;
    },
    queryKey: ["userVerification", userId, eventId],
  });

  isRegistered = Boolean(newData?.isRegistered);

  const {
    mutate: mutateRegistrationStatus,
    isPending: isPendingRegistrationStatus,
  } = useMutation({
    mutationFn: () =>
      authAxios.post(
        "/api/registration",
        {
          userId,
          eventId,
        },
        { withCredentials: true }
      ),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["userVerification", userId, eventId],
      });
      // handleDialogOnOpenChange(false);
      // navigate({ to: "/dashboard" });
    },
    onError: (err: AxiosError<{ errors?: { email?: string } }>) => {
      console.error(err);
    },
  });

  function handleRegistration() {
    if (userId && eventId) {
      mutateRegistrationStatus();
    }
  }

  console.log({ newData });

  return (
    <aside className="lg:col-span-1">
      <div className="rounded-xl border border-border p-5 sticky top-24">
        <div className="text-2xl font-bold text-foreground">
          {eventPrice > 0 ? `$${eventPrice.toFixed(2)}` : "Free"}
        </div>
        <div className="mt-4 text-sm">
          <div className="text-muted-foreground">Spaces Available:</div>
          <div className="font-semibold">{eventCapacity}</div>
        </div>
        {isLoggedIn ? (
          <>
            {!isCurrentUser && (
              <>
                {isRegistered ? (
                  <button
                    disabled
                    className="mt-4 inline-flex w-full items-center justify-center rounded-md text-sm font-medium bg-secondary text-secondary-foreground shadow-none h-10 opacity-70 cursor-not-allowed"
                  >
                    Already Registered
                  </button>
                ) : (
                  <button
                    className="mt-4 inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10"
                    onClick={handleRegistration}
                    disabled={isPendingRegistrationStatus}
                  >
                    {isPendingRegistrationStatus
                      ? "Registerring..."
                      : "Register Now"}
                  </button>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="mt-4 inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10"
              search={{
                openLoginDialogue: true,
              }}
            >
              Login to Register
            </Link>
            <p className="mt-2 text-[11px] text-muted-foreground text-center">
              You must be logged in to register for this event
            </p>
          </>
        )}
      </div>
    </aside>
  );
};

export default RegistrationCard;

import { Icons } from '../shared/Icons';

interface TypeMismatchErrorProps {
  usernames: { user1: string; user2: string } | null;
  user1Type: string;
  user2Type: string;
  user1Avatar?: string;
  user2Avatar?: string;
}

export default function TypeMismatchError({
  usernames,
  user1Type,
  user2Type,
  user1Avatar,
  user2Avatar,
}: TypeMismatchErrorProps) {
  if (!usernames) return null;

  return (
    <div className="bg-accent-danger/10 border-l-4 border-accent-danger p-4 sm:p-6 rounded-lg my-4 sm:my-6 animate-fade-in">
      <div className="flex items-start gap-2 sm:gap-4">
        <div className="text-accent-danger hidden sm:block">
          <Icons.AlertCircle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-medium text-accent-danger mb-2 flex items-center gap-2">
            <Icons.AlertCircle className="w-5 h-5 sm:hidden" />
            <Icons.SwitchHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
            Type Mismatch Error
          </h3>

          <div className="p-3 sm:p-4 bg-accent-danger/5 rounded-lg mb-3 sm:mb-4 border border-accent-danger/20">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-accent-danger mb-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {user1Type === 'organization' ? (
                  <Icons.Building className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                ) : (
                  <Icons.User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                )}
                <span className="font-semibold text-sm sm:text-base break-all">
                  {usernames.user1}
                </span>
                <span className="bg-accent-danger/20 text-accent-danger text-xs rounded-full px-2 py-0.5 ml-0 sm:ml-1">
                  {user1Type}
                </span>
              </div>

              <Icons.Close className="hidden sm:block w-5 h-5 mx-2" />
              <div className="flex items-center text-accent-danger/80 sm:hidden my-1">
                <Icons.ArrowRight className="w-3 h-3 mx-1 rotate-90" />
                <span className="text-xs">incompatible with</span>
                <Icons.ArrowRight className="w-3 h-3 mx-1 rotate-90" />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {user2Type === 'organization' ? (
                  <Icons.Building className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                ) : (
                  <Icons.User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                )}
                <span className="font-semibold text-sm sm:text-base break-all">
                  {usernames.user2}
                </span>
                <span className="bg-accent-danger/20 text-accent-danger text-xs rounded-full px-2 py-0.5 ml-0 sm:ml-1">
                  {user2Type}
                </span>
              </div>
            </div>

            <p className="text-accent-danger/90 text-xs sm:text-sm">
              Cannot compare a GitHub {user1Type} with a GitHub {user2Type}.
              These entity types have different metrics and scoring systems.
            </p>
          </div>

          <p className="text-accent-danger font-medium mb-3 flex items-center text-sm sm:text-base">
            <Icons.Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
            Please select two entities of the same type to battle.
          </p>

          <div className="mt-3 text-xs sm:text-sm bg-l-bg-1 dark:bg-d-bg-1 p-3 sm:p-4 rounded-lg border border-border-l/40 dark:border-border-d/40">
            <p className="font-medium mb-2 sm:mb-3 text-l-text-1 dark:text-d-text-1 flex items-center">
              <Icons.Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-accent-success" />
              Valid combinations:
            </p>

            <div className="grid grid-cols-1 gap-3 mb-4">
              {/* User vs User option */}
              <div className="flex items-center gap-2 bg-l-bg-2 dark:bg-d-bg-2 p-2 sm:p-3 rounded-lg border border-border-l/40 dark:border-border-d/40 hover:border-accent-success hover:shadow-sm transition-all">
                <div className="flex items-center gap-1 sm:gap-1.5 bg-accent-success/10 p-1 sm:p-1.5 rounded-md">
                  <Icons.User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-1" />
                  <span className="font-medium">User</span>
                </div>
                <Icons.ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-l-text-3 dark:text-d-text-3" />
                <div className="flex items-center gap-1 sm:gap-1.5 bg-accent-success/10 p-1 sm:p-1.5 rounded-md">
                  <Icons.User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-1" />
                  <span className="font-medium">User</span>
                </div>
              </div>

              {/* Org vs Org option */}
              <div className="flex items-center gap-2 bg-l-bg-2 dark:bg-d-bg-2 p-2 sm:p-3 rounded-lg border border-border-l/40 dark:border-border-d/40 hover:border-accent-success hover:shadow-sm transition-all">
                <div className="flex items-center gap-1 sm:gap-1.5 bg-accent-success/10 p-1 sm:p-1.5 rounded-md">
                  <Icons.Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-1" />
                  <span className="font-medium text-xs sm:text-sm">
                    Organization
                  </span>
                </div>
                <Icons.ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-l-text-3 dark:text-d-text-3" />
                <div className="flex items-center gap-1 sm:gap-1.5 bg-accent-success/10 p-1 sm:p-1.5 rounded-md">
                  <Icons.Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-1" />
                  <span className="font-medium text-xs sm:text-sm">
                    Organization
                  </span>
                </div>
              </div>
            </div>

            {/* Current invalid match */}
            <div className="mt-3 sm:mt-4 border-t border-border-l/30 dark:border-border-d/30 pt-3 sm:pt-4">
              <p className="font-medium mb-2 sm:mb-3 text-l-text-1 dark:text-d-text-1 flex items-center">
                <Icons.Close className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-accent-danger" />
                Your invalid selection:
              </p>

              <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 bg-accent-danger/5 p-2 sm:p-3 rounded-lg border border-accent-danger/20">
                <div className="flex flex-col items-center w-1/3 sm:w-auto">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mb-1 border-2 border-accent-danger/30">
                    <img
                      src={user1Avatar}
                      alt={usernames.user1}
                      className="w-full h-full object-cover"
                      onError={e => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${usernames.user1}&background=random`;
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {user1Type === 'organization' ? (
                      <Icons.Building className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent-danger" />
                    ) : (
                      <Icons.User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent-danger" />
                    )}
                    <span
                      className="font-medium text-xs max-w-20 truncate"
                      title={usernames.user1}
                    >
                      {usernames.user1.length > 10
                        ? `${usernames.user1.substring(0, 10)}...`
                        : usernames.user1}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs bg-accent-danger/20 text-accent-danger px-1.5 sm:px-2 py-0.5 mt-1 rounded-full">
                    {user1Type}
                  </span>
                </div>

                <div className="flex flex-col items-center w-1/4 sm:w-auto">
                  <Icons.Close className="w-5 h-5 sm:w-6 sm:h-6 text-accent-danger" />
                  <span className="text-[10px] sm:text-xs text-accent-danger mt-1">
                    Incompatible
                  </span>
                </div>

                <div className="flex flex-col items-center w-1/3 sm:w-auto">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mb-1 border-2 border-accent-danger/30">
                    <img
                      src={user2Avatar}
                      alt={usernames.user2}
                      className="w-full h-full object-cover"
                      onError={e => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${usernames.user2}&background=random`;
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {user2Type === 'organization' ? (
                      <Icons.Building className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent-danger" />
                    ) : (
                      <Icons.User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent-danger" />
                    )}
                    <span
                      className="font-medium text-xs max-w-20 truncate"
                      title={usernames.user2}
                    >
                      {usernames.user2.length > 10
                        ? `${usernames.user2.substring(0, 10)}...`
                        : usernames.user2}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs bg-accent-danger/20 text-accent-danger px-1.5 sm:px-2 py-0.5 mt-1 rounded-full">
                    {user2Type}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

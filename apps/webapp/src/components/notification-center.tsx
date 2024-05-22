import { useNotifications } from "@/hooks/use-notifications";
import { Button } from "@guesthub/ui/button";
import { MEDIA_QUERIES } from "@guesthub/ui/lib";
import { Popover, PopoverContent, PopoverTrigger } from "@guesthub/ui/popover";
import { ScrollArea } from "@guesthub/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@guesthub/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { Archive, Bell, Inbox, Mail, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

const EmptyState = ({ description }: { description: string }) => {
  return (
    <div className="h-[460px] flex items-center justify-center flex-col space-y-4">
      <div className="w-12 h-12 rounded-full bg-background-subtle flex items-center justify-center">
        <Inbox size={18} />
      </div>
      <p className="text-foreground-subtle text-sm">{description}</p>
    </div>
  );
};

function NotificationItem({
  id,
  description,
  createdAt,
  markMessageAsRead,
}: {
  id: string;
  setOpen: (value: boolean) => void;
  description: string;
  createdAt: string;
  recordId?: string;
  from?: string;
  to?: string;
  markMessageAsRead?: (id: string) => void;
}) {
  return (
    <div className="flex items-between justify-between space-x-4 px-3 py-3 hover:bg-background-subtle">
      <div>
        <div className="h-9 w-9 flex items-center justify-center space-y-0 border border-border-subtle rounded-full">
          <Mail size={17} />
        </div>
      </div>
      <div>
        <p className="text-sm">{description}</p>
        <span className="text-xs text-[#606060]">
          {formatDistanceToNow(new Date(createdAt))} ago
        </span>
      </div>
      {markMessageAsRead && (
        <div>
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-transparent hover:bg-background-surface"
            onClick={() => markMessageAsRead(id)}
          >
            <Archive strokeWidth={1.25} size={20} />
          </Button>
        </div>
      )}
    </div>
  );
}

export function NotificationCenter() {
  const [isOpen, setOpen] = useState(false);
  const {
    hasUnseenNotificaitons,
    notifications,
    markMessageAsRead,
    markAllMessagesAsSeen,
    markAllMessagesAsRead,
  } = useNotifications();
  const isDesktop = useMediaQuery(MEDIA_QUERIES.MD);

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read
  );

  const archivedNotifications = notifications.filter(
    (notification) => notification.read
  );

  useEffect(() => {
    if (isOpen && hasUnseenNotificaitons) {
      markAllMessagesAsSeen();
    }
  }, [hasUnseenNotificaitons, isOpen, markAllMessagesAsSeen]);

  return (
    <Popover onOpenChange={setOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <div className="md:border md:p-2 rounded-full cursor-pointer relative">
          {hasUnseenNotificaitons && (
            <div className="w-1.5 h-1.5 bg-[#FFD02B] rounded-full absolute top-0 right-1" />
          )}
          <Bell strokeWidth={isDesktop ? 1.25 : 2} className="h-5 w-5" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="rounded-xl h-[535px] w-screen max-w-[400px] mr-7 p-0 overflow-hidden relative"
        sideOffset={10}
      >
        <Tabs defaultValue="inbox">
          <div className="w-full flex flex-row border-b-[1px] rounded-none items-center justify-between py-1">
            <TabsList className="justify-start bg-transparent rounded-none py-0 my-0">
              <TabsTrigger
                value="inbox"
                className="font-normal border-none data-[state=active]:shadow-none data-[state=active]:bg-background-subtle data-[state=active]:text-foreground"
              >
                Inbox
              </TabsTrigger>
              <TabsTrigger
                value="archive"
                className="font-normal border-none data-[state=active]:shadow-none data-[state=active]:bg-background-subtle data-[state=active]:text-foreground"
              >
                Archive
              </TabsTrigger>
            </TabsList>

            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-transparent hover:bg-background-surface"
              onClick={() => setOpen(false)}
            >
              <Settings className="text-[#606060]" size={16} />
            </Button>
          </div>

          <TabsContent value="inbox" className="relative mt-0">
            {!unreadNotifications.length && (
              <EmptyState description="No new notifications" />
            )}

            {unreadNotifications.length > 0 && (
              <ScrollArea className="pb-12 h-[485px]">
                <div className="divide-y">
                  {unreadNotifications.map((notification) => {
                    return (
                      <NotificationItem
                        key={notification._id}
                        id={notification._id}
                        markMessageAsRead={markMessageAsRead}
                        setOpen={setOpen}
                        description={notification.payload.description as string}
                        createdAt={notification.createdAt}
                      />
                    );
                  })}
                </div>
              </ScrollArea>
            )}

            {unreadNotifications.length > 0 && (
              <div className="h-12 w-full absolute bottom-0 flex items-center justify-center border-t-[1px]">
                <Button
                  variant="secondary"
                  className="bg-transparent"
                  onClick={markAllMessagesAsRead}
                >
                  Archive all
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="archive" className="mt-0">
            {!archivedNotifications.length && (
              <EmptyState description="Nothing in the archive" />
            )}

            {archivedNotifications.length > 0 && (
              <ScrollArea className="h-[490px]">
                <div className="divide-y">
                  {archivedNotifications.map((notification) => {
                    return (
                      <NotificationItem
                        key={notification._id}
                        id={notification._id}
                        setOpen={setOpen}
                        description={notification.payload.description as string}
                        createdAt={notification.createdAt}
                      />
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

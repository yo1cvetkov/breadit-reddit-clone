"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/Button";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import useCustomToast from "@/hooks/use-custom-toast";
import { toast } from "react-hot-toast";
import { startTransition } from "react";
import { useRouter } from "next/navigation";

interface SubscribeToLeaveToggleProps {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
}

export default function SubscribeLeaveToggle({
  subredditId,
  subredditName,
  isSubscribed,
}: SubscribeToLeaveToggleProps) {
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: subscribe, isLoading: isSubscribing } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post("/api/subreddit/subscribe", payload);

      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast.error("There was a problem subscribing to this subreddit");
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      toast.success(`Successfully subscribed to r/${subredditName}`);
    },
  });

  const { mutate: unsubscribe, isLoading: isUnsubscribing } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post("/api/subreddit/unsubscribe", payload);

      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast.error("There was a problem unsubscribing to this subreddit");
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      toast.success(`Successfully unsubscribed from r/${subredditName}`);
    },
  });

  return isSubscribed ? (
    <Button
      onClick={() => unsubscribe()}
      isLoading={isUnsubscribing}
      disabled={isUnsubscribing}
      className="w-full mt-1 mb-4"
    >
      Leave community
    </Button>
  ) : (
    <Button
      isLoading={isSubscribing}
      disabled={isSubscribing}
      onClick={() => subscribe()}
      className="w-full mt-1 mb-4"
    >
      Join to post
    </Button>
  );
}

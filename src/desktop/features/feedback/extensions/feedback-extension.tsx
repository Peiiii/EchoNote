import { openFeedbackModal } from "@/common/features/feedback/open-feedback-modal";
import { ActivityBarGroup, useActivityBarStore } from "@/core/stores/activity-bar.store";
import { defineExtension, Disposable } from "@cardos/extension";

export const feedbackExtension = defineExtension({
  manifest: {
    id: "feedback",
    name: "Feedback",
    description: "Send product feedback to the StillRoot team",
    version: "1.0.0",
    author: "StillRoot Team",
    icon: "heart",
  },
  activate: ({ subscriptions }) => {
    // Register activity bar item in footer
    subscriptions.push(
      Disposable.from(
        useActivityBarStore.getState().addItem({
          id: "feedback",
          label: "Feedback",
          title: "Product Feedback",
          group: ActivityBarGroup.FOOTER,
          icon: "heart",
          order: 1000,
          iconColor: "text-pink-600 dark:text-pink-400",
          onClick: () => {
            openFeedbackModal();
          },
        })
      )
    );
  },
});

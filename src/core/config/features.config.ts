export const getFeaturesConfig = () => {
  return {
    /* Channel or Timeline */
    channel: {
      autoCreateDefault: {
        enabled: false,
      },
      settings: {
        enabled: false,
      },
      input: {
        emoji: {
          enabled: false,
        },
        image: {
          enabled: false,
        },
        file: {
          enabled: false,
        },
        voice: {
          enabled: false,
        },
        more: {
          enabled: false,
        },
        call: {
          enabled: false,
        },
        video: {
          enabled: false,
        },
      },
      thoughtRecord: {
        edit: {
          enabled: true,
        },
        sparks: {
          enabled: true,
        },
        viewDetails: {
          enabled: false,
        },
        bookmark: {
          enabled: false,
        },
        reply: {
          enabled: false,
        },
        tags: {
          enabled: true,
        },
        thread: {
          enabled: false,
        },
      },
    },
  };
};

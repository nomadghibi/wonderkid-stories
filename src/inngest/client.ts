import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "wonderkid-stories",
  name: "WonderKid Stories",
});

export type GenerateBookEvent = {
  name: "book/generate";
  data: {
    bookId: string;
    userId: string;
  };
};

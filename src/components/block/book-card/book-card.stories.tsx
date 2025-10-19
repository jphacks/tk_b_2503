import BookCard from "./book-card";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof BookCard> = {
  title: "Components/BookCard",
  component: BookCard,
  argTypes: {
    type: {
      control: "select",
      options: ["new", "own", "search"],
    },
  },
  args: {
    href: "#",
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof BookCard>;

export const New: Story = {
  args: {
    type: "new",
    title: "新しい本を登録",
    subtitle: "読みたい作品を追加しましょう",
  },
};

export const Own: Story = {
  args: {
    type: "own",
    title: "本棚を管理",
    subtitle: "所持している本を整理できます",
  },
};

export const Search: Story = {
  args: {
    type: "search",
    title: "本を探す",
    subtitle: "気になる作品を検索しましょう",
  },
};

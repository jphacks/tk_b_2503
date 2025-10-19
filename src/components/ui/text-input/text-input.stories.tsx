import { TextInput } from "./text-input";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof TextInput> = {
  title: "UI/TextInput",
  component: TextInput,
  args: {
    id: "default-input",
    label: "デフォルト入力",
    value: "",
    onChange: () => {},
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "url", "tel"],
    },
    required: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TextInput>;

export const Default: Story = {};

export const WithPlaceholder: Story = {
  args: {
    id: "placeholder-input",
    label: "プレースホルダー付き",
    value: "",
    onChange: () => {},
    placeholder: "ここに入力してください",
  },
};

export const Required: Story = {
  args: {
    id: "required-input",
    label: "必須入力",
    value: "",
    onChange: () => {},
    required: true,
  },
};

export const WithError: Story = {
  args: {
    id: "error-input",
    label: "エラー付き",
    value: "invalid@",
    onChange: () => {},
    error: "正しいメールアドレスを入力してください",
  },
};

export const WithHint: Story = {
  args: {
    id: "hint-input",
    label: "ヒント付き",
    value: "",
    onChange: () => {},
    hint: "8文字以上のパスワードを入力してください",
  },
};

export const Disabled: Story = {
  args: {
    id: "disabled-input",
    label: "無効化",
    value: "無効化された値",
    onChange: () => {},
    disabled: true,
  },
};

export const Email: Story = {
  args: {
    id: "email-input",
    label: "メールアドレス",
    value: "",
    onChange: () => {},
    type: "email",
    placeholder: "example@example.com",
    autoComplete: "email",
  },
};

export const Password: Story = {
  args: {
    id: "password-input",
    label: "パスワード",
    value: "",
    onChange: () => {},
    type: "password",
    placeholder: "パスワードを入力",
    autoComplete: "current-password",
  },
};

export const WithMaxLength: Story = {
  args: {
    id: "maxlength-input",
    label: "文字数制限",
    value: "",
    onChange: () => {},
    maxLength: 50,
    hint: "50文字以内で入力してください",
  },
};

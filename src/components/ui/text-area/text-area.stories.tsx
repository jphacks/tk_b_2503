import { TextArea } from "./text-area";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof TextArea> = {
  title: "UI/TextArea",
  component: TextArea,
  args: {
    id: "default-textarea",
    label: "デフォルトテキストエリア",
    value: "",
    onChange: () => {},
  },
  argTypes: {
    required: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    rows: {
      control: "number",
    },
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof TextArea>;

export const Default: Story = {};

export const WithPlaceholder: Story = {
  args: {
    id: "placeholder-textarea",
    label: "プレースホルダー付き",
    value: "",
    onChange: () => {},
    placeholder: "ここにテキストを入力してください",
  },
};

export const Required: Story = {
  args: {
    id: "required-textarea",
    label: "必須入力",
    value: "",
    onChange: () => {},
    required: true,
  },
};

export const WithError: Story = {
  args: {
    id: "error-textarea",
    label: "エラー付き",
    value: "不正な値",
    onChange: () => {},
    error: "正しい値を入力してください",
  },
};

export const WithHint: Story = {
  args: {
    id: "hint-textarea",
    label: "ヒント付き",
    value: "",
    onChange: () => {},
    hint: "詳細な説明を入力してください",
  },
};

export const Disabled: Story = {
  args: {
    id: "disabled-textarea",
    label: "無効化",
    value: "無効化された値",
    onChange: () => {},
    disabled: true,
  },
};

export const WithRows: Story = {
  args: {
    id: "rows-textarea",
    label: "行数指定",
    value: "",
    onChange: () => {},
    rows: 6,
    placeholder: "6行のテキストエリア",
  },
};

export const WithMaxLength: Story = {
  args: {
    id: "maxlength-textarea",
    label: "文字数制限",
    value: "",
    onChange: () => {},
    maxLength: 200,
    hint: "200文字以内で入力してください",
  },
};

export const ReadOnly: Story = {
  args: {
    id: "readonly-textarea",
    label: "読み取り専用",
    value: "これは読み取り専用のテキストです。編集できません。",
    onChange: () => {},
    readOnly: true,
  },
};

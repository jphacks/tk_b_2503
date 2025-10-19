import type { TextImageRequest } from "#/libs/text-to-image/types";

type Canvas2DContext =
  | CanvasRenderingContext2D
  | OffscreenCanvasRenderingContext2D;

type CanvasLike = {
  canvas: OffscreenCanvas | HTMLCanvasElement;
  context: Canvas2DContext;
  width: number;
  height: number;
};

const letterSpacing = 2;
const lineHeight = 60.5;
const padding = {
  top: 10,
  right: 10,
  bottom: 16,
  left: 10,
};

const drawTextOnCanvas = (
  context: Canvas2DContext,
  payload: TextImageRequest
) => {
  // フォントスタイルの設定
  const fontFamily = "'M PLUS Rounded 1c', sans-serif";
  context.font = `${500} ${29}px ${fontFamily}`;
  context.fillStyle = "#000000";
  context.textAlign = "start";
  context.textBaseline = "top";

  const lines = payload.text.split("\n");
  const startY = padding.top;

  drawHorizontalText(context, lines, payload, startY);
};

const drawHorizontalText = (
  context: Canvas2DContext,
  lines: string[],
  payload: TextImageRequest,
  startY: number
) => {
  const xStart: number = padding.left;
  const maxX: number = payload.width - padding.right;

  const textAreaLeft = padding.left;
  const textAreaTop = padding.top;
  const textAreaWidth = payload.width - padding.left - padding.right;

  context.save();
  context.strokeStyle = "#e5e7eb"; // 薄いグレー
  context.lineWidth = 1;

  // 行罫線（行高さに基づいて水平線を引く）
  for (
    let y = textAreaTop + lineHeight - 24;
    y <= payload.height;
    y += lineHeight
  ) {
    context.beginPath();
    context.moveTo(textAreaLeft, y);
    context.lineTo(textAreaLeft + textAreaWidth, y);
    context.stroke();
  }

  context.restore();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let currentLine = i;
    let currentX = xStart;

    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      const chWidth = context.measureText(ch).width;

      // 折り返し判定（現在の文字がはみ出す場合は改行）
      if (currentX + chWidth > maxX) {
        currentLine += 1;
        currentX = xStart;
      }

      const y = startY + currentLine * lineHeight;
      context.fillStyle = "#111827";
      context.fillText(ch, currentX, y);

      // 文字幅に letterSpacing を加算して次の描画位置へ
      currentX += chWidth + letterSpacing;
    }

    // 次の元の行は常に次の行から開始する
    currentLine += 1;
  }
};

const resolveScale = (value: number | undefined) => {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
    return 1;
  }

  return value;
};

const createCanvas = (
  scale: number,
  width: number,
  height: number
): CanvasLike => {
  const scaledWidth = Math.max(1, Math.round(width * scale));
  const scaledHeight = Math.max(1, Math.round(height * scale));

  if (typeof OffscreenCanvas !== "undefined") {
    const canvas = new OffscreenCanvas(scaledWidth, scaledHeight);
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("2Dコンテキストの生成に失敗しました");
    }

    return { canvas, context, width: scaledWidth, height: scaledHeight };
  }

  if (
    typeof document !== "undefined" &&
    typeof document.createElement === "function"
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("2Dコンテキストの生成に失敗しました");
    }

    return { canvas, context, width: scaledWidth, height: scaledHeight };
  }

  throw new Error("適切なCanvasコンテキストを生成できませんでした");
};

const convertCanvasToBlob = async (
  canvas: OffscreenCanvas | HTMLCanvasElement
) => {
  if ("convertToBlob" in canvas) {
    return canvas.convertToBlob({ type: "image/png" });
  }

  return new Promise<Blob>((resolve, reject) => {
    if ("toBlob" in canvas && typeof canvas.toBlob === "function") {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("PNGの生成に失敗しました"));
          return;
        }

        resolve(blob);
      }, "image/png");
      return;
    }

    reject(new Error("PNGの生成に失敗しました"));
  });
};

export const renderTextToPng = async (
  payload: TextImageRequest
): Promise<{
  blob: Blob;
}> => {
  try {
    const scale = resolveScale(payload.scale);
    const { canvas, context } = createCanvas(
      scale,
      payload.width,
      payload.height
    );

    // キャンバスのスケールを設定
    context.setTransform(scale, 0, 0, scale, 0, 0);

    // 背景を描画
    context.fillStyle = "white";
    context.fillRect(0, 0, payload.width, payload.height);

    // テキストを直接キャンバスに描画
    drawTextOnCanvas(context, payload);

    // スケールをリセット
    context.setTransform(1, 0, 0, 1, 0, 0);
    const blob = await convertCanvasToBlob(canvas);

    return { blob };
  } catch (error) {
    console.error("テキスト画像生成エラー:", error);
    throw new Error("テキスト画像の生成に失敗しました");
  }
};

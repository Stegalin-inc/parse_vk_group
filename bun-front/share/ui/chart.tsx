import { useEffect, useRef, useState } from "preact/hooks";

type Props<T> = {
  data: T[];
  tip: (r: T, idx: number) => string;
  charts: {
    getter: (r: T) => number;
    color: string;
  }[];
  scale?: number;
  h?: number;
  w?: number;
};
export const Chart = <T,>({ data, charts, scale = 7, h = 150, w = 300, tip }: Props<T>) => {
  const cnvRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    for (let chart of charts) {
      const getter = chart.getter;
      ctx.strokeStyle = chart.color;
      ctx.beginPath();
      for (let i = 0; i < data.length; ++i) {
        ctx.lineTo(i * scale * zoom, h - getter(data[i]) * scale);
        ctx.stroke();
      }
    }
  }, [data]);

  useEffect(() => {
    if (!ctx) return;
    ctx.scale(zoom, 1);
  }, [zoom]);

  const wheel = (e: WheelEvent) => {
    e.stopPropagation();

    if (e.deltaY > 0) {
      setZoom(zoom * 1.1);
    } else {
      setZoom(zoom / 1.1);
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    const x = ~~(e.offsetX / scale);
    tip(data[x], x);
  };

  return (
    <>
      <canvas
        ref={(e) => {
          if (!e) return;
          cnvRef.current = e;
          setCtx(e.getContext("2d"));
        }}
        height={h}
        width={w}
        onWheel={wheel}
        onMouseMove={onMouseMove}
      />
    </>
  );

  return (
    <>
      {data.forEach((x, i) => {
        return i;
      })}
    </>
  );
};

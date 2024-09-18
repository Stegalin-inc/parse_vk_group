import { useEffect, useRef } from 'preact/hooks'

type Props<T> = {
    data: T[],
    getter: (r: T) => number,
    scale?: number
    h?: number
    w?: number

}
export const Chart = <T,>({ data, getter, scale = 7, h=150, w=300 }: Props<T>) => {
    const cnvRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const ctx = cnvRef.current?.getContext('2d')
        for(let i = 0; i< data.length; ++i){
            console.log(i*scale, getter(data[i])*scale)
            ctx?.lineTo(i*scale, h-getter(data[i])*scale)
            // ctx?.stroke()
        }
     }, [data])

    return <canvas ref={cnvRef} height={h} width={w} />

    return <>
        {data.forEach((x, i) => {
            return i
        })}
    </>

}
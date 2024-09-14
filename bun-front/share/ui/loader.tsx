import { useEffect, useRef, useState } from 'preact/hooks'

export const Loader = () => {
    const [step, setStep] = useState(1)
    const spanRef = useRef<HTMLSpanElement | null>(null)
    const steps = ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛']
    // const steps='⌛⏳⌚⏰⏱⏲🕰'
    useEffect(() => {
        let s = 0;
        const id = setInterval(() => {
            if (!spanRef.current) return
            spanRef.current.innerText = steps[s++ % steps.length]
        }, 100)
        return () => clearInterval(id)
        setTimeout(() => setStep(step + 1), 400)
    }, [step])

    return <span ref={spanRef}></span>

    return <>{steps[step % steps.length]}</>
}
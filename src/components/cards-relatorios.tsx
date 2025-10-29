import Link from "next/link"
import { useEffect, useRef, useState } from "react"
interface ICard {
  title: string,
  descricao: string,
  imagem: string,
  bg_imagem:string,
  url:string
}

export default function Card({ title, descricao, imagem, bg_imagem, url }: ICard) {

  // obter card
  const cardRef = useRef<HTMLDivElement>(null)

  const [isCompact, setIsCompact] = useState(false)

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setIsCompact(entry.contentRect.width < 300)
    });
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect()
  }, [])

  return (
    <div className="bg-[#FFFFFF] rounded-[10px] max-w-[475px] hover drop-shadow-[2px_2px_4px_rgba(0,0,0,0.20)] overflow-hidden transition-transform duration-300 hover:scale-105">
      <div ref={cardRef} className={isCompact ? "flex flex-col gap-[30px] p-[35px] items-center text-center" : "flex flex-row gap-[30px] p-[35px] min-h-[190px]"}>
        <div className={isCompact ? "" : "pt-[10px] flex-shrink-0"}>
          <div className={"flex items-center justify-center w-[100px] h-[100px] rounded-[50%] " + bg_imagem}>
            <img src={imagem} alt="" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-[26px] mb-[5px] overflow-hidden text-ellipsis whitespace-nowrap">{title}</h2>
          <span className="text-[#6B7280] font-semibold text-[16px] block overflow-hidden text-ellipsis line-clamp-2">{descricao}</span>
        </div>
      </div>
      <hr className=" border-[#4f668c71]" />
      <div className="text-center p-[16px] text-[#5676A1] overflow-hidden">
        <Link href={url} className="inline-flex items-center group font-medium transition-all duration-300 hover:text-[#3d5576] hover:scale-105">
          Acessar
          <img className="ml-[8px] w-[6px] transition-transform duration-300 group-hover:translate-x-1" src="/acessar.svg" alt="" />
        </Link>
      </div>
    </div>
  )
}
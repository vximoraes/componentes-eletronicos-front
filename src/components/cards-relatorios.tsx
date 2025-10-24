
interface ICard {
  title:string,
  descricao:string,
  imagem:string
}

export default function Card({title, descricao, imagem}: ICard){
  return(
    <div className="bg-[#FFFFFF] border-[#4F668C] border-[0.5px] rounded-[10px] max-w-[475px]">
      <div className="flex flex-row">
        <div>
          <div className="flex items-center justify-center w-[100px] h-[100px] bg-[#DBEAFE] rounded-[50%]">
            <img src={imagem} alt="" />
          </div>
        </div>
        <div>
          <h4>{title}</h4>
          <span>{descricao}</span>
        </div>
      </div>
      <div>
        <a href="/componentes">Acessar </a>
      </div>
    </div>
  )
}
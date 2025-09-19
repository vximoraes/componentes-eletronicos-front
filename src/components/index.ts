export default function toggleSVG(nome:string){
  const img = document.querySelector<HTMLImageElement>(`.${nome}`) as HTMLImageElement
  // const grayStyle = "brightness(0) saturate(100%) invert(73%) sepia(7%) saturate(463%) hue-rotate(201deg) brightness(95%) contrast(90%)"
  // if(img.style.filter != "") img.style.filter = ""
  // else img.style.filter = grayStyle;
  img.src = "componentes.svg"
  console.log("AQUI")
}
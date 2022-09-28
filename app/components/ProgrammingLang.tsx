import type { IconType } from 'react-icons'

type Props = {
  size: number,
  color: string,
  programmingLang: string[],
  project: GithubRepoType,
  Icon: IconType,
}

const ProgrammingLang = ({ size, color, programmingLang, project, Icon }: Props) => {
  const findLang = (lang: string[]) => {
    let found = false
    lang.forEach((l: string) => {
      if (project?.topics.find((topic: string) => topic.toLowerCase().includes(l))) {
        found = true
      }
    });
    return found;
  }

  return (
    <>{findLang(programmingLang) && <Icon size={size} className={`mx-2 drop-shadow-xl text-slate-500 hover:scale-125 hover:${color} transition-all duration-500`} />}</>
  )
}

export default ProgrammingLang;

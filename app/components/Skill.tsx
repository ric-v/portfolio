type Props = {
  skill: string,
}

const Skill = ({ skill }: Props) => {
  return (
    <div className='flex flex-row items-center justify-center'>
      {skill}
    </div>
  )
}

export default Skill
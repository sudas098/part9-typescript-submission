import { assertNever, type CoursePart } from "../type";

interface ContentProps {
  courseParts: CoursePart[];
}

const Content = ({ courseParts }: ContentProps) => {
  return (
    <>
      {courseParts.map((part, index) => {
        switch (part.kind) {
          case 'basic':
            return <p key={index}>{part.name} {part.exerciseCount} {part.description}</p>;
          case 'group':
            return <p key={index}>{part.name} {part.exerciseCount} {part.groupProjectCount}</p>;
          case 'background':
            return <p key={index}>{part.name} {part.exerciseCount} {part.description} {part.backgroundMaterial}</p>;
          case 'special':
            return (
              <p key={index}>
                {part.name} {part.exerciseCount} {part.description} 
                required skills: {part.requirements.join(", ")}
              </p>
            );
          default:
            return assertNever(part);
        }
      })}
    </>
  );
};

export default Content;
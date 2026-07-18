import type { CoursePart } from "../type";

interface TotalProps {
    courseParts: CoursePart[];
}

const Total = ({courseParts}: TotalProps) => {
     
    const total = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

    return (
        <>
          <p>
            Total number of exercises: {total}
          </p>
        </>
    )
}

export default Total;
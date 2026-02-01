import { CategoryShow } from "../allbooks/CategoryShow";
import { StyleHeader } from "./StyleHeader";

const Addbooks = () => {
  return (
    <div>
      <div className="space-y-8">
        {/* Style Section Header */}
        <StyleHeader />

        {/* add category component */}

        <CategoryShow />
      </div>
    </div>
  );
};

export default Addbooks;

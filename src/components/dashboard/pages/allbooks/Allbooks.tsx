import { CategoryShow } from "./CategoryShow";
import OrderedBooks from "./OrderedBooks";

const Allbooks = () => {
  return (
    <div>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#FF8B36] mb-1">
              All Books
            </h1>
            {/* <p className="text-gray-500 font-medium">
                            Manage your orders, track shipments, and configure products easily.
                        </p> */}
        </div>
        </div>
        <OrderedBooks />
      </div>
      <CategoryShow />
    </div>
  );
};

export default Allbooks;

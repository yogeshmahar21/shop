const CategoriesPage = () => {
    const categories = ['Mechanical', 'Electrical', 'Architecture', 'Civil', 'Robotics'];
  
    return (
      <div className="page-container">
        <h1>All Categories</h1>
        <ul>
          {categories.map((cat) => (
            <li key={cat}>{cat}</li>
          ))}
        </ul>
      </div>
    );
  };
  export default CategoriesPage;
  
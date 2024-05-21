import Header from "../../header/Header";
import AdminNavigation from "./AdminNavigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, updateUserRole } from "../../features/userSlice";

export default function AdminList() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(8);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  if (!users || users.length === 0) {
    return <div>Loading or no users available...</div>;
  }

  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);
  const handleClick = (pageNumber) => setCurrentPage(pageNumber);

  const handleNextbtn = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);

    if (newPage > maxPageNumberLimit && newPage <= totalPages) {
      setMaxPageNumberLimit(maxPageNumberLimit + 1);
      setMinPageNumberLimit(minPageNumberLimit + 1);
    }
  };

  const handlePrevbtn = () => {
    const newPage = currentPage - 1;
    setCurrentPage(newPage);

    if (newPage < minPageNumberLimit + 1 && newPage >= 1) {
      setMaxPageNumberLimit(maxPageNumberLimit - 1);
      setMinPageNumberLimit(minPageNumberLimit - 1);
    }
  };

  if (error) return <p>Error: {error}</p>;

  const toggleAdmin = (userId) => {
    const user = users.find((u) => u._id === userId);
    const newRole = !user.isAdmin;
    const confirmation = window.confirm(
      `Are you sure to change the role of ${user.firstname} ${user.lastname}？`
    );
    if (confirmation) {
      dispatch(updateUserRole({ userId: user._id, isAdmin: newRole }));
      dispatch(fetchAllUsers());
    }
  };

  return (
    <div className="p-4">
      <Header />
      <AdminNavigation />
      <h2 className="font-bold text-lg">Users and Administrators</h2>
      <table className="min-w-full leading-normal mt-4">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Name
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Email
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Character
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Operation
            </th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user._id.$oid}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {user.firstname} {user.lastname}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {user.email}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {user.isAdmin ? "Admin" : "User"}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <button
                  className={`py-2 px-4 font-bold rounded text-white ${
                    user.isAdmin
                      ? "bg-red-500 hover:bg-red-700"
                      : "bg-green-500 hover:bg-green-700"
                  }`}
                  onClick={() => toggleAdmin(user._id)}
                >
                  {user.isAdmin ? "Demote to User" : "Promote to Administrator"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4 items-center">
        <button
          className="mx-1 px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
          onClick={handlePrevbtn}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          if (page < maxPageNumberLimit + 1 && page > minPageNumberLimit) {
            return (
              <button
                key={page}
                onClick={() => handleClick(page)}
                className={`mx-1 px-4 py-2 rounded ${
                  currentPage === page
                    ? "bg-blue-600"
                    : "bg-blue-300 hover:bg-blue-400"
                } text-white`}
              >
                {page}
              </button>
            );
          } else {
            return null;
          }
        })}
        <button
          className="mx-1 px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
          onClick={handleNextbtn}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

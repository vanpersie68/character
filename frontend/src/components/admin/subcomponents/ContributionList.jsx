import Header from "../../header/Header";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchContributions,
  updateContributionReview,
  resetContributionState,
} from "../../features/contributionSlice";
import { getAllCharacters } from "../../features/characterSlice";
import Modal from "./Modal";
import AdminNavigation from "./AdminNavigation";

export default function ContributionList() {
  const dispatch = useDispatch();
  const contributions = useSelector(
    (state) => state.contributions.contributions
  );
  const userId = useSelector((state) => state.user.user._id);
  const characters = useSelector((state) => state.characters.characters);
  const message = useSelector((state) => state.contributions.message);

  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedContribution, setselectedContribution] = useState(null);

  useEffect(() => {
    dispatch(fetchContributions());
    dispatch(getAllCharacters());
    if (message) {
      alert(message);
      dispatch(resetContributionState());
    }
  }, [message, dispatch]);

  const handleCloseModal = () => {
    setSelectedCharacter(null);
  };
  const handleApprove = async (contributionId) => {
    await dispatch(
      updateContributionReview({
        contributionId: contributionId,
        status: "Approved",
        reviewerId: userId,
      })
    );
    dispatch(fetchContributions());
  };

  const handleReject = async (contributionId) => {
    await dispatch(
      updateContributionReview({
        contributionId: contributionId,
        status: "Rejected",
        reviewerId: userId,
      })
    );
    dispatch(fetchContributions());
  };

  return (
    <div className="p-4">
      <Header />
      <AdminNavigation />
      {contributions.data?.map((contribution) => {
        const isEditCharacterPending =
          contribution.status === "Pending" &&
          contribution.action === "EditCharacter";
        const isAddCharacter = contribution.action === "AddCharacter";
        const currentCharacter = isEditCharacterPending
          ? characters.find((char) => char.id === contribution.data.id)
          : null;
        return (
          <div
            key={contribution.contribution_id}
            className="bg-white shadow rounded-lg p-4 mb-4"
          >
            <table className="w-full text-sm text-left text-gray-500">
              <tbody>
                <tr>
                  <td className="font-bold p-2">Applier ID</td>
                  <td className="p-2">{contribution.user_id._id}</td>
                </tr>
                <tr>
                  <td className="font-bold p-2">Action</td>
                  <td
                    className="p-2"
                    style={{
                      color:
                        contribution.action === "AddCharacter"
                          ? "#4CAF50"
                          : "#FF9800",
                    }}
                  >
                    {contribution.action}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold p-2">Status</td>
                  <td className="p-2">{contribution.status}</td>
                </tr>
                <tr>
                  <td className="font-bold p-2">Reviewer ID</td>
                  <td className="p-2">
                    {contribution.reviewed_by
                      ? contribution.reviewed_by._id.$oid
                      : "None"}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold p-2">Date</td>
                  <td className="p-2">
                    {new Date(contribution.date).toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 mb-4">
              {isAddCharacter && (
                <div className="mt-4">
                  <h4
                    className="text-lg font-bold"
                    style={{ color: "#4CAF50" }}
                  >
                    New Character Details
                  </h4>
                  <table className="w-full text-sm text-left text-gray-500">
                    <tbody>
                      {/* Display submitted data for new character */}
                      <tr>
                        {Object.entries(contribution.data).map(
                          ([key, value]) => (
                            <th className="font-bold p-2 capitalize">{key}</th>
                          )
                        )}
                      </tr>
                      <tr>
                        {Object.entries(contribution.data).map(
                          ([key, value]) => (
                            <td className="p-2">{value}</td>
                          )
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {!isAddCharacter && !isEditCharacterPending && (
                <div className="mt-4">
                  <h4 className="text-lg font-bold">
                    Edited Character Details
                  </h4>
                  <table className="w-full text-sm text-left text-gray-500">
                    <tbody>
                      {/* Display submitted data for edited character */}
                      <tr>
                        {Object.entries(contribution.data).map(
                          ([key, value]) => (
                            <th className="font-bold p-2 capitalize">{key}</th>
                          )
                        )}
                      </tr>
                      <tr>
                        {Object.entries(contribution.data).map(
                          ([key, value]) => (
                            <td className="p-2">{value}</td>
                          )
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {!isAddCharacter &&
                isEditCharacterPending &&
                currentCharacter && (
                  <div className="mt-4">
                    <h3 className="text-lg font-bold">
                      Current Character Details vs Proposed Changes
                    </h3>
                    <table className="w-full text-sm text-left text-gray-500">
                      <tr>
                        {Object.entries(contribution.data).map(
                          ([key, value]) => (
                            <th className="font-bold p-2 capitalize">{key}</th>
                          )
                        )}
                      </tr>
                      <tr>
                        {Object.entries(contribution.data).map(
                          ([key, value]) => (
                            <td className="p-2">{value}</td>
                          )
                        )}
                      </tr>
                      <tr>
                        {Object.entries(contribution.data).map(
                          ([key, value]) => (
                            <td className="p-2">{currentCharacter[key]}</td>
                          )
                        )}
                      </tr>
                    </table>
                  </div>
                )}
            </div>

            {contribution.status === "Pending" && (
              <div className="flex justify-end mt-4">
                <button
                  className="py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded mr-2"
                  onClick={() => handleApprove(contribution.contribution_id)}
                >
                  Approve
                </button>
                <button
                  className="py-2 px-4 bg-red-500 hover:bg-red-700 text-white font-bold rounded"
                  onClick={() => handleReject(contribution.contribution_id)}
                >
                  Reject
                </button>
              </div>
            )}
            {contribution.status === "Approved" && (
              <div className="flex justify-end mt-4">
                <button
                  className="py-2 px-4 bg-gray-500  text-white font-bold rounded mr-2"
                  //   onClick={() => handleApprove(contribution.contribution_id)}
                >
                  Approved
                </button>
              </div>
            )}
            {contribution.status === "Rejected" && (
              <div className="flex justify-end mt-4">
                <button
                  className="py-2 px-4 bg-gray-500  text-white font-bold rounded mr-2"
                  //   onClick={() => handleApprove(contribution.contribution_id)}
                >
                  Rejected
                </button>
              </div>
            )}
          </div>
        );
      })}
      {selectedCharacter && (
        <Modal
          character={selectedCharacter}
          onClose={handleCloseModal}
          actions={[
            {
              label: "Approve",
              onClick: () => handleApprove(selectedContribution),
              styles: "bg-green-500 hover:bg-green-700",
            },
            {
              label: "Reject",
              onClick: () => handleReject(selectedContribution),
              styles: "bg-red-500 hover:bg-red-700",
            },
          ]}
        />
      )}
    </div>
  );
}

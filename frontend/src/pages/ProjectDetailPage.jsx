import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProjectDetailPage() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [testCases, setTestCases] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("pending");
    const [priority, setPriority] = useState("medium");
    const [expectedResult, setExpectedResult] = useState("");
    const [steps, setSteps] = useState([{ action: "", expectedResult: "" }]);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editStatus, setEditStatus] = useState("pending");
    const [editPriority, setEditPriority] = useState("medium");
    const [editExpectedResult, setEditExpectedResult] = useState("");
    const [editSteps, setEditSteps] = useState([{ action: "", expectedResult: "" }]);

    const [isEditingMembers, setIsEditingMembers] = useState(false);
    const [memberEmails, setMemberEmails] = useState([""]);

    const token = localStorage.getItem('token');

    const fetchProject = async () => {
        const res = await fetch(`/api/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setProject(data);
    };

    const fetchTestCases = async () => {
        const res = await fetch(`/api/projects/${id}/testcases`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setTestCases(data);
    };

    useEffect(() => {
        fetchProject();
        fetchTestCases();
    }, []);

    const handleStepChange = (index, field, value) => {
        const updated = [...steps];
        updated[index] = { ...updated[index], [field]: value };
        setSteps(updated);
    };

    const handleAddStep = () => {
        setSteps([...steps, { action: "", expectedResult: "" }]);
    };

    const handleRemoveStep = (index) => {
        const updated = steps.filter((_, i) => i !== index);
        setSteps(updated.length > 0 ? updated : [{ action: "", expectedResult: "" }]);
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        const cleanedSteps = steps
            .filter((s) => s.action.trim() !== "")
            .map((s, index) => ({
                stepNum: index + 1,
                action: s.action,
                expectedResult: s.expectedResult
            }));

        const res = await fetch(`/api/projects/${id}/create-testcase`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, status, priority, expectedResult, steps: cleanedSteps }),
        });
        const data = await res.json();
        if (res.ok) {
            fetchTestCases();
            setTitle("");
            setDescription("");
            setStatus("pending");
            setPriority("medium");
            setExpectedResult("");
            setSteps([{ action: "", expectedResult: "" }]);
        } else {
            alert(data.error);
        }
    };

    const handleDelete = async (testCaseId) => {
        const res = await fetch(`/api/testcases/${testCaseId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            fetchTestCases();
        } else {
            const data = await res.json();
            alert(data.error);
        }
    };

    const handleEdit = (tc) => {
        setEditingId(tc._id);
        setEditTitle(tc.title);
        setEditDescription(tc.description);
        setEditStatus(tc.status);
        setEditPriority(tc.priority);
        setEditExpectedResult(tc.expectedResult);
        setEditSteps(
            tc.steps && tc.steps.length > 0
                ? tc.steps.map((s) => ({ action: s.action, expectedResult: s.expectedResult }))
                : [{ action: "", expectedResult: "" }]
        );
    };

    const handleEditStepChange = (index, field, value) => {
        const updated = [...editSteps];
        updated[index] = { ...updated[index], [field]: value };
        setEditSteps(updated);
    };

    const handleAddEditStep = () => {
        setEditSteps([...editSteps, { action: "", expectedResult: "" }]);
    };

    const handleRemoveEditStep = (index) => {
        const updated = editSteps.filter((_, i) => i !== index);
        setEditSteps(updated.length > 0 ? updated : [{ action: "", expectedResult: "" }]);
    };

    const handleUpdate = async (testCaseId) => {
        const cleanedSteps = editSteps
            .filter((s) => s.action.trim() !== "")
            .map((s, index) => ({
                stepNum: index + 1,
                action: s.action,
                expectedResult: s.expectedResult
            }));

        const res = await fetch(`/api/testcases/${testCaseId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                title: editTitle,
                description: editDescription,
                status: editStatus,
                priority: editPriority,
                expectedResult: editExpectedResult,
                steps: cleanedSteps
            }),
        });
        if (res.ok) {
            setEditingId(null);
            fetchTestCases();
        } else {
            const data = await res.json();
            alert(data.error);
        }
    };

    const handleEditMembers = () => {
        const initialEmails = project.members && project.members.length > 0
            ? project.members.map((m) => (typeof m === "object" ? m.email : ""))
            : [""];
        setMemberEmails(initialEmails);
        setIsEditingMembers(true);
    };

    const handleMemberEmailChange = (index, value) => {
        const updated = [...memberEmails];
        updated[index] = value;
        setMemberEmails(updated);
    };

    const handleAddMemberField = () => {
        setMemberEmails([...memberEmails, ""]);
    };

    const handleRemoveMemberField = (index) => {
        const updated = memberEmails.filter((_, i) => i !== index);
        setMemberEmails(updated.length > 0 ? updated : [""]);
    };

    const handleUpdateMembers = async () => {
        const cleanedEmails = memberEmails
            .map((email) => email.trim())
            .filter((email) => email !== "");

        const res = await fetch(`/api/projects/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ members: cleanedEmails }),
        });
        const data = await res.json();
        if (res.ok) {
            setIsEditingMembers(false);
            fetchProject();
        } else {
            alert(data.error);
        }
    };

    const badgeClassForStatus = (s) => `badge badge-${s}`;
    const badgeClassForPriority = (p) => `badge badge-${p}`;

    return (
        <div className="page-wrapper page-wrapper--wide">
            <h1 className="page-title">{project ? project.name : "Loading..."}</h1>

            <h2 className="section-heading">Members</h2>
            {isEditingMembers ? (
                <div className="card">
                    {memberEmails.map((email, index) => (
                        <div key={index} className="member-edit-row">
                            <input
                                className="form-control"
                                value={email}
                                onChange={(e) => handleMemberEmailChange(index, e.target.value)}
                                placeholder="member@email.com"
                            />
                            <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                onClick={() => handleRemoveMemberField(index)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                        <button type="button" className="btn btn-outline btn-sm" onClick={handleAddMemberField}>
                            + Add member
                        </button>
                        <button type="button" className="btn btn-primary btn-sm" onClick={handleUpdateMembers}>
                            Save
                        </button>
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsEditingMembers(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <ul className="member-list">
                        {project && project.members && project.members.map((m, index) => (
                            <li key={index} className="member-chip">
                                {typeof m === "object" ? m.email : m}
                            </li>
                        ))}
                    </ul>
                    <button className="btn btn-outline btn-sm" onClick={handleEditMembers}>Edit members</button>
                </div>
            )}

            <h2 className="section-heading">Test Cases</h2>

            <form onSubmit={handleCreate} className="card">
                <div className="form-group">
                    <input
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                    />
                </div>
                <div className="form-group">
                    <input
                        className="form-control"
                        value={expectedResult}
                        onChange={(e) => setExpectedResult(e.target.value)}
                        placeholder="Expected Result"
                        required
                    />
                </div>
                <div className="form-grid">
                    <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="passed">Passed</option>
                        <option value="failed">Failed</option>
                        <option value="blocked">Blocked</option>
                    </select>
                    <select className="form-control" value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
                <div className="steps-section">
                    <label className="form-label">Steps</label>
                    {steps.map((step, index) => (
                        <div key={index} className="step-row">
                            <span className="step-number">{index + 1}</span>
                            <input
                                className="form-control"
                                value={step.action}
                                onChange={(e) => handleStepChange(index, "action", e.target.value)}
                                placeholder="Action"
                            />
                            <input
                                className="form-control"
                                value={step.expectedResult}
                                onChange={(e) => handleStepChange(index, "expectedResult", e.target.value)}
                                placeholder="Expected result for this step"
                            />
                            <button type="button" className="btn btn-outline btn-sm" onClick={() => handleRemoveStep(index)}>
                                Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" className="btn btn-outline btn-sm" onClick={handleAddStep}>
                        + Add step
                    </button>
                </div>
                <button type="submit" className="btn btn-primary">Add Test Case</button>
            </form>

            {testCases.map(tc => (
                <div key={tc._id} className="testcase-card">
                    {editingId === tc._id ? (
                        <>
                            <div className="form-group">
                                <input className="form-control" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <input className="form-control" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <input className="form-control" value={editExpectedResult} onChange={(e) => setEditExpectedResult(e.target.value)} />
                            </div>
                            <div className="form-grid">
                                <select className="form-control" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                                    <option value="pending">Pending</option>
                                    <option value="passed">Passed</option>
                                    <option value="failed">Failed</option>
                                    <option value="blocked">Blocked</option>
                                </select>
                                <select className="form-control" value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                            <div className="steps-section">
                                <label className="form-label">Steps</label>
                                {editSteps.map((step, index) => (
                                    <div key={index} className="step-row">
                                        <span className="step-number">{index + 1}</span>
                                        <input
                                            className="form-control"
                                            value={step.action}
                                            onChange={(e) => handleEditStepChange(index, "action", e.target.value)}
                                            placeholder="Action"
                                        />
                                        <input
                                            className="form-control"
                                            value={step.expectedResult}
                                            onChange={(e) => handleEditStepChange(index, "expectedResult", e.target.value)}
                                            placeholder="Expected result for this step"
                                        />
                                        <button type="button" className="btn btn-outline btn-sm" onClick={() => handleRemoveEditStep(index)}>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button type="button" className="btn btn-outline btn-sm" onClick={handleAddEditStep}>
                                    + Add step
                                </button>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button className="btn btn-primary btn-sm" onClick={() => handleUpdate(tc._id)}>Save</button>
                                <button className="btn btn-outline btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="testcase-header">
                                <span className="testcase-title">{tc.title}</span>
                                <div className="testcase-badges">
                                    <span className={badgeClassForStatus(tc.status)}>{tc.status}</span>
                                    <span className={badgeClassForPriority(tc.priority)}>{tc.priority}</span>
                                </div>
                            </div>
                            <div className="testcase-body">
                                {tc.description}
                                <br />
                                <strong>Expected:</strong> {tc.expectedResult}
                                {tc.steps && tc.steps.length > 0 && (
                                    <ol className="steps-list">
                                        {tc.steps.map((s, index) => (
                                            <li key={index}>
                                                {s.action}
                                                {s.expectedResult && <> — <strong>expect:</strong> {s.expectedResult}</>}
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button className="btn btn-outline btn-sm" onClick={() => handleEdit(tc)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(tc._id)}>Delete</button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

export default ProjectDetailPage;
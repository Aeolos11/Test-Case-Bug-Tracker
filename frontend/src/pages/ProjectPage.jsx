import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProjectPage() {
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const fetchProjects = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/projects', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setProjects(data);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const res = await fetch('/api/create-project', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ name, description }),
        });
        const data = await res.json();
        if (res.ok) {
            fetchProjects();
            setName("");
            setDescription("");
        } else {
            alert(data.error);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/projects/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            fetchProjects();
        } else {
            const data = await res.json();
            alert(data.error);
        }
    };

    const handleEdit = (p) => {
        setEditingId(p._id);
        setEditName(p.name);
        setEditDescription(p.description);
    };

    const handleUpdate = async (id) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/projects/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ name: editName, description: editDescription }),
        });
        if (res.ok) {
            setEditingId(null);
            fetchProjects();
        } else {
            const data = await res.json();
            alert(data.error);
        }
    };

    return (
        <div className="page-wrapper">
            <h1 className="page-title">Projects</h1>

            <form onSubmit={handleCreate} className="inline-form">
                <input
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Project name"
                />
                <input
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                />
                <button type="submit" className="btn btn-primary">Create</button>
            </form>

            <ul className="item-list">
                {projects.map(p => (
                    <li key={p._id} className="item-row">
                        {editingId === p._id ? (
                            <div className="item-edit-form">
                                <input
                                    className="form-control"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                                <input
                                    className="form-control"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                />
                                <div className="item-actions">
                                    <button className="btn btn-primary btn-sm" onClick={() => handleUpdate(p._id)}>Save</button>
                                    <button className="btn btn-outline btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="item-info">
                                    <Link to={`/projects/${p._id}`} className="item-title">{p.name}</Link>
                                    <span className="item-description">{p.description}</span>
                                </div>
                                <div className="item-actions">
                                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProjectPage;
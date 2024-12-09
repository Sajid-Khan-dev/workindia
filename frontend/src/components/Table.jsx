import React, { useEffect, useState } from 'react';
import './Table.css'; // We'll create this next.

const Table = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/items')
            .then((response) => response.json())
            .then((data) => setItems(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    return (
        <table className="styled-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;

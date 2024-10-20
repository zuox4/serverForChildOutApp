import React, {useEffect, useState} from 'react';

const MultiSelectDropdown = ({url, name}) => {
    const options = [
        { id: 1, label: 'Авдеева Юлия' },
        { id: 2, label: 'Алиев Асман' },
        { id: 3, label: 'Бернтгардт Арсений' },
    ];


    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionChange = (optionId) => {
        setSelectedOptions((prevSelected) =>
            prevSelected.includes(optionId)
                ? prevSelected.filter((id) => id !== optionId)
                : [...prevSelected, optionId]
        );
    };

    const handleSubmit = () => {
        console.log('Отсутствуют'+ {name}, selectedOptions);
        setIsOpen(false)
    };

    return (
        <div>
            <div onClick={toggleDropdown} style={{ border: '1px solid #ccc', padding: '10px', cursor: 'pointer' }}>
                {selectedOptions.length > 0
                    ? `Отсутствуют ${name}: ${selectedOptions.map(id => options.find(option => option.id === id).label).join(', ')}`
                    : 'Отсутствуют по '+name + ': ' + selectedOptions.length}
            </div>
            {isOpen && (
                <div style={{ border: '1px solid #ccc', marginTop: '5px', padding: '10px', position: 'flex', background: 'white' }}>
                    {options.map((option) => (
                        <div key={option.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedOptions.includes(option.id)}
                                    onChange={() => handleOptionChange(option.id)}
                                />
                                {option.label}
                            </label>
                        </div>
                    ))}
                    <button onClick={handleSubmit} style={{ marginTop: '10px' }}>Подтвердить выбор</button>
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
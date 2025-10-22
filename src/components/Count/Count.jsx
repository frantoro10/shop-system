import React, { useState, useEffect } from 'react';
import styles from './Count.module.scss';

const Count = ({ count, onChangeCount }) => {
    const [selectedCount, setSelectedCount] = useState(count);

    useEffect(() => {
        setSelectedCount(count);
    }, [count]);

    const addCount = () => {
        const newCount = selectedCount + 1;
        setSelectedCount(newCount);
        onChangeCount(newCount);
    };

    const lessCount = () => {
        if (selectedCount > 1) {
            const newCount = selectedCount - 1;
            setSelectedCount(newCount);
            onChangeCount(newCount);
        }
    };

    return (
        <div className={styles['count-container']}>
            <button onClick={lessCount} className={styles['count-button']}>-</button>
            <span className={styles['count-display']}>{selectedCount}</span>
            <button onClick={addCount} className={styles['count-button']}>+</button>
        </div>
    );
};

export default Count;

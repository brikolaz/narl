import React from 'react';
import type { Renderable } from '../model/Renderable';

type TileProps = Renderable;

const Tile: React.FC<TileProps> = ({ content, background }) => {
    return (
        <div
            style={{ backgroundColor: background ?? 'black', height: '48px', width: '48px', border: '1px solid white' }}
        >
            {content ?? ' '}
        </div>
    );
};

export default Tile;
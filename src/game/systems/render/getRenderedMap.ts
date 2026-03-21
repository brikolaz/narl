import { last } from "lodash";
import { getComponentByType } from "../../../core/ecs/queries/component";
import { MISSING_COLOR, MISSING_GLYPH } from "../../../utils/constants";
import { ApperanceComponent } from "../../model/components/ApperanceComponent";
import { GlyphComponent } from "../../model/components/GlyphComponent";
import { PositionComponent } from "../../model/components/PositionComponent";
import type { GameState } from "../../state/state";
import { RenderedTile } from "./types";

const resolveGlyph = (itemGlyph: GlyphComponent | undefined, floorGlyph: GlyphComponent | undefined) => {
    return itemGlyph?.glyph ?? floorGlyph?.glyph ?? MISSING_GLYPH;
}

export const getRenderedMap = (gameState: GameState) => {
    const playerGlyph = getComponentByType(gameState.player, GlyphComponent);
    const playerPosition = getComponentByType(gameState.player, PositionComponent);

    const renderedMap: RenderedTile[] = gameState.tiles.map((floor, index) => {
        const floorGlyph = getComponentByType(floor, GlyphComponent);
        const floorAppearance = getComponentByType(floor, ApperanceComponent);
        if (playerGlyph && index === playerPosition?.position) {
            return new RenderedTile({ char: playerGlyph.glyph ?? '', background: floorAppearance?.background ?? MISSING_COLOR });
        }

        const items = gameState.items;
        const lastItem = last(items);

        if (lastItem && floorAppearance && floorGlyph) {
            const itemGlyph = getComponentByType(lastItem, GlyphComponent);
            const itemPosition = getComponentByType(lastItem, PositionComponent);
            if (itemGlyph && itemPosition?.position === index) {
                return new RenderedTile({ char: resolveGlyph(itemGlyph, floorGlyph), background: floorAppearance.background ?? MISSING_COLOR });
            }
        }

        return new RenderedTile({ char: floorGlyph?.glyph ?? '', background: floorAppearance?.background ?? MISSING_COLOR });
    })

    return renderedMap;
}
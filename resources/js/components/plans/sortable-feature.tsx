import { arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, XIcon } from 'lucide-react';

import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

function SortableItem({
    id,
    feature,
    index,
    handleRemoveFeature,
}: {
    id: string;
    feature: string;
    index: number;
    handleRemoveFeature: (index: number) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center justify-between gap-2 rounded border border-border p-2 px-4">
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="cursor-grab text-muted-foreground hover:text-muted-foreground/80 active:cursor-grabbing"
                >
                    <GripVertical className="h-4 w-4" />
                </button>
                <span>{feature}</span>
            </div>
            <button type="button" onClick={() => handleRemoveFeature(index)} className="rounded-full p-1 text-red-500">
                <XIcon className="h-4 w-4" />
            </button>
        </div>
    );
}

export const SortableFeature = ({
    features,
    handleReorderFeatures,
    handleRemoveFeature,
}: {
    features: string[];
    handleReorderFeatures: (features: string[]) => void;
    handleRemoveFeature: (index: number) => void;
}) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = features.findIndex((feature) => feature === active.id);
            const newIndex = features.findIndex((feature) => feature === over?.id);
            const newFeatures = arrayMove(features, oldIndex, newIndex);
            handleReorderFeatures(newFeatures);
        }
    };
    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
            <SortableContext items={features} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                    {features.map((feature, index) => (
                        <SortableItem
                            key={`item-${feature}-${index}`}
                            id={feature}
                            feature={feature}
                            index={index}
                            handleRemoveFeature={handleRemoveFeature}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};

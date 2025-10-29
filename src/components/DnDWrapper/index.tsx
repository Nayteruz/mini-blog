import type { ReactNode } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent, MeasuringStrategy, DragOverlay } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface IDnDWrapperProps<T> {
  children: ReactNode
  onDragEnd: (event: DragEndEvent) => void
  items: T[]
}

const restrictToVerticalAxis = ({ transform }: any) => {
  return {
    ...transform,
    x: 0,
  };
};

export const DnDWrapper = <T extends { id: string }>({ children, onDragEnd, items }: IDnDWrapperProps<T>) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Нужно протащить 8px чтобы начать drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const measuringConfig = {
    droppable: {
      strategy: MeasuringStrategy.Always, // Всегда измерять
    },
  };

  return (
    <DndContext
      sensors={sensors}
      measuring={measuringConfig}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      <DragOverlay />
    </DndContext>
  )
};
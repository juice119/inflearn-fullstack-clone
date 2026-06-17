'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { Course } from '@/generated/openapi.ts';
import { AddLectureDialog } from './_components/add-lecture-dialog';
import { CurriculumEmptyState } from './_components/curriculum-empty-state';
import { DeleteConfirmDialog } from './_components/delete-confirm-dialog';
import { EditLectureDialog } from './_components/edit-lecture-dialog';
import { SectionCard } from './_components/section-card';
import { SectionToolbar } from './_components/section-toolbar';
import { CurriculumProvider, useCurriculumContext } from './_context/curriculum-context';

const DELETE_DIALOG_MESSAGE = {
  section: {
    title: '섹션을 삭제하시겠습니까?',
    description: '섹션에 포함된 수업도 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다.',
  },
  lecture: {
    title: '수업을 삭제하시겠습니까?',
    description: '삭제한 수업은 복구할 수 없습니다.',
  },
};

export default function EditCurriculumUI({ initialCourse }: { initialCourse: Course }) {
  return (
    <CurriculumProvider course={initialCourse}>
      <TooltipProvider>
        <CurriculumContent />
      </TooltipProvider>
    </CurriculumProvider>
  );
}

function CurriculumContent() {
  const {
    sections,
    guideBarIndex,
    deleteTarget,
    confirmDelete,
    cancelDelete,
    isDeletingSection,
    isDeletingLecture,
    lecture: { editLecture, isEditLectureDialogOpen, setIsEditLectureDialogOpen, setEditLecture },
  } = useCurriculumContext();

  const deleteDialogMessage = deleteTarget
    ? DELETE_DIALOG_MESSAGE[deleteTarget.type]
    : DELETE_DIALOG_MESSAGE.lecture;

  return (
    <div className="min-w-0">
      <div className="mb-8">
        <h1 className="text-[22px] font-bold text-foreground">커리큘럼</h1>
      </div>
      {sections.length === 0 ? (
        <CurriculumEmptyState />
      ) : (
        <div>
          {sections.map((section, index) => (
            <div key={section.id} className={index < sections.length - 1 ? 'mb-6' : undefined}>
              <SectionCard section={section} index={index} />

              {guideBarIndex === index && (
                <div className="mt-3">
                  <SectionToolbar />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <AddLectureDialog />
      {deleteTarget && (
        <DeleteConfirmDialog
          title={deleteDialogMessage.title}
          description={deleteDialogMessage.description}
          onOpenChange={(open) => {
            if (!open) cancelDelete();
          }}
          onConfirm={confirmDelete}
          isPending={isDeletingSection || isDeletingLecture}
        />
      )}
      {editLecture && (
        <EditLectureDialog
          isOpen={isEditLectureDialogOpen}
          onClose={() => {
            setEditLecture(undefined);
            setIsEditLectureDialogOpen(false);
          }}
          lecture={editLecture}
        />
      )}
    </div>
  );
}

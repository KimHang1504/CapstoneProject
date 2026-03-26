import { TestType } from "@/api/admin/testtype/type";

export type TestTypeRowForm = {
  name: string;
  description: string;
  totalQuestions: string;
};

export type TestTypeRowProps = {
  item: TestType;
  isCreating: boolean;
  editingId: number | null;
  importingId: number | null;
  onStartEdit: (item: TestType) => void;
  onImportFile: (id: number, file: File | null) => void;
};

export type TestTypeEditRowProps = {
  item: TestType;
  editRow: TestTypeRowForm;
  savingEdit: boolean;
  onChangeEditRow: (field: keyof TestTypeRowForm, value: string) => void;
  onSaveEdit: (id: number) => void;
  onCancelEdit: () => void;
};

export type TestTypeCreateRowProps = {
  newRow: TestTypeRowForm;
  savingCreate: boolean;
  onChangeNewRow: (field: keyof TestTypeRowForm, value: string) => void;
  onSaveCreate: () => void;
  onCancelCreate: () => void;
};

export type TestTypeTableProps = {
  items: TestType[];
  loading: boolean;
  isCreating: boolean;
  editingId: number | null;
  savingCreate: boolean;
  savingEdit: boolean;
  importingId: number | null;
  newRow: TestTypeRowForm;
  editRow: TestTypeRowForm;
  onChangeNewRow: (field: keyof TestTypeRowForm, value: string) => void;
  onChangeEditRow: (field: keyof TestTypeRowForm, value: string) => void;
  onSaveCreate: () => void;
  onCancelCreate: () => void;
  onStartEdit: (item: TestType) => void;
  onSaveEdit: (id: number) => void;
  onCancelEdit: () => void;
  onImportFile: (id: number, file: File | null) => void;
};
/**
 * DS Matriz — Exportação de Componentes
 *
 * Barrel export de todos os componentes do Design System.
 */

// Componentes Base
export { DSButton, type DSButtonProps } from './DSButton';
export { DSInput, type DSInputProps } from './DSInput';
export { DSTag, type DSTagProps } from './DSTag';
export { DSChip, type DSChipProps } from './DSChip';
export { DSSwitch, type DSSwitchProps } from './DSSwitch';
export { DSSlider, type DSSliderProps } from './DSSlider';

// Componentes de Formulário
export { DSSelect, type DSSelectProps } from './DSSelect';
export {
  DSCheckbox,
  DSRadio,
  DSCheckboxGroup,
  DSRadioGroup,
  type DSCheckboxProps,
  type DSRadioProps,
  type DSCheckboxGroupProps,
  type DSRadioGroupProps,
} from './DSCheckboxRadio';

// Componentes de Feedback
export { DSAlertCard, type DSAlertCardProps } from './DSAlertCard';
export { DSModal, type DSModalProps } from './DSModal';
export { DSDrawer, type DSDrawerProps } from './DSDrawer';
export { DSSkeleton, DSSkeletonGroup, type DSSkeletonProps, type DSSkeletonGroupProps } from './DSSkeleton';
export { DSEmptyState, type DSEmptyStateProps } from './DSEmptyState';
export { DSToastProvider, useToast, type DSToastProviderProps, type ToastAPI } from './DSToast';

// Componentes de Navegação
export { DSTabBar, type DSTabBarProps, type Tab } from './DSTabBar';
export { DSAccordion, type DSAccordionProps, type DSAccordionItem } from './DSAccordion';
export { DSStepper, type DSStepperProps, type Step } from './DSStepper';

// Componentes de Card
export { CardFundo, type CardFundoProps, type CardFundoField, type CardFundoDocument } from './CardFundo';
export { DSCard, type DSCardProps } from './DSCard';

// TODO: Adicionar demais componentes conforme forem criados
// export { DSDataCardAction, type DSDataCardActionProps } from './DSDataCardAction';
// export { DSHeroCard, type DSHeroCardProps } from './DSHeroCard';
// export { DSDatePicker, type DSDatePickerProps } from './DSDatePicker';
// export { DSTabs, type DSTabsProps } from './DSTabs';
// export { DSTable, type DSTableProps } from './DSTable';

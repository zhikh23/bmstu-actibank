export enum FormStatus {
  Draft = 'draft',  // Черновик, виден только автору
  Pending = 'pending',  // Созданная заявка, ожидает модерации
  Approved = 'approved',  // Принятая модератором заявка
  Reviewing = 'reviewing', // Гарантия экслюзивного модерирования
  Canceled = 'canceled',  // Отклонена заявителем
  Rejected = 'rejected',  // Отклонена модератором
}

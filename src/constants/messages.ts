export const MESSAGES = {
  PROCESSING: {
    GENERAL: 'Đang xử lý...',
    CREATE: 'Đang tạo dữ liệu...',
    UPDATE: 'Đang cập nhật dữ liệu...',
    DELETE: 'Đang xóa dữ liệu...',
    STATUS_CHANGE: 'Đang thay đổi trạng thái...',
  },
  SUCCESS: {
    CREATE: 'Thêm mới thành công.',
    UPDATE: 'Cập nhật thành công.',
    DELETE: 'Xóa thành công.',
    STATUS_CHANGE: 'Thay đổi trạng thái thành công.',
  },
  ERROR: {
    CREATE: 'Thêm mới thất bại. Vui lòng thử lại.',
    UPDATE: 'Cập nhật thất bại. Vui lòng thử lại.',
    DELETE: 'Xóa thất bại. Vui lòng thử lại.',
    STATUS_CHANGE: 'Thay đổi trạng thái thất bại. Vui lòng thử lại.',
    GENERAL: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
  },
  CONFIRM: {
    DELETE_TITLE: 'Xác nhận xóa',
    DELETE_DESC: 'Bạn có chắc chắn muốn xóa bản ghi này? Hành động này không thể hoàn tác.',
  },
  ORDERS: {
    GENERAL: {
      SUCCESS: {
        CONFIRM_BULK: 'Đã xác nhận {count} đơn hàng thành công.',
        SHIP_SUCCESS: 'Đã bàn giao đơn hàng cho đơn vị vận chuyển.',
        CANCEL_SUCCESS: 'Đã hủy đơn hàng thành công.',
        EXPORT_CSV: 'Đã xuất {count} đơn hàng ra CSV.',
        PRINT_WAYBILLS: 'Đã mở bản in vận đơn cho {count} đơn hàng.',
        PUSH_WAREHOUSE: 'Đã gửi {count} đơn hàng sang kho để xử lý.',
      },
      ERROR: {
        CONFIRM_BULK: 'Không thể xác nhận hàng loạt lúc này. Vui lòng thử lại.',
        DELETE: 'Không thể xóa đơn hàng. Vui lòng thử lại.',
        SHIP_ERROR: 'Không thể bàn giao đơn hàng lúc này. Vui lòng thử lại.',
        CANCEL_ERROR: 'Không thể hủy đơn hàng lúc này. Vui lòng thử lại.',
      },
      INFO: {
        NO_SELECTION: 'Vui lòng chọn ít nhất một đơn hàng.',
        NO_DATA_EXPORT: 'Không có đơn hàng nào để xuất dữ liệu.',
      },
      CONFIRM: {
        DELETE_DESC: 'Bạn có chắc chắn muốn xóa đơn hàng {code}? Hành động này không thể hoàn tác.',
        CANCEL_TITLE: 'Xác nhận hủy đơn hàng',
        CANCEL_DESC: 'Bạn có chắc chắn muốn hủy đơn hàng {code}? Hành động này không thể hoàn tác.',
        SHIP_TITLE: 'Bàn giao vận chuyển',
        SHIP_DESC: 'Xác nhận đơn hàng {code} đã được bàn giao cho đơn vị vận chuyển?',
        CONFIRM_BULK_TITLE: 'Xác nhận đơn hàng',
        CONFIRM_BULK_DESC: 'Bạn có chắc chắn muốn xác nhận {count} đơn hàng này?',
      },
    },
    PENDING_ACTIONS: {
      SUCCESS: {
        APPROVE_BULK: 'Đã duyệt đơn hàng đã chọn thành công.',
        PRINT_BULK: 'Đã cập nhật trạng thái in cho đơn hàng đã chọn.',
        CANCEL_BULK: 'Đã hủy đơn hàng đã chọn thành công.',
        EXPORT_CSV: 'Đã xuất danh sách đơn chờ xử lý ra CSV.',
      },
      ERROR: {
        APPROVE_BULK: 'Không thể duyệt đơn hàng đã chọn. Vui lòng thử lại.',
        PRINT_BULK: 'Không thể cập nhật trạng thái in. Vui lòng thử lại.',
        CANCEL_BULK: 'Không thể hủy đơn hàng đã chọn. Vui lòng thử lại.',
      },
      INFO: {
        NO_ROWS_EXPORT: 'Không có đơn nào để xuất CSV.',
      },
      FORM: {
        CREATE_TITLE: 'Thêm đơn chờ xử lý',
        UPDATE_TITLE: 'Chỉnh sửa đơn chờ xử lý',
        CREATE_SUBMIT: 'Thêm đơn',
        UPDATE_SUBMIT: 'Lưu thay đổi',
        DELETE_CONFIRM_TITLE: 'Xác nhận xóa đơn chờ xử lý',
      },
    },
  },
  DASHBOARD: {
    KPI_OVERVIEW: {
      STATUS: {
        SUCCESS: 'Thành công',
        PROCESSING: 'Đang xử lý',
        CANCELLED: 'Đã hủy',
        ERROR: 'Lỗi',
      },
      FORM: {
        CREATE_TITLE: 'Thêm cấu hình KPI',
        UPDATE_TITLE: 'Chỉnh sửa cấu hình KPI',
        METRIC_LABEL: 'Loại chỉ số',
        NAME_LABEL: 'Tên hiển thị',
        STATUS_LABEL: 'Trạng thái',
        CREATE_SUBMIT: 'Thêm mới',
        UPDATE_SUBMIT: 'Lưu thay đổi',
      },
      CONFIRM: {
        DELETE_TITLE: 'Xác nhận xóa cấu hình KPI',
        DELETE_DESC: 'Bạn có chắc chắn muốn xóa cấu hình KPI này? Hành động này không thể hoàn tác.',
      },
      BUTTON: {
        ADD: 'Thêm cấu hình',
        ADD_LOADING: 'Đang thêm...',
        EDIT: 'Sửa',
        EDIT_LOADING: 'Đang lưu...',
        DELETE: 'Xóa',
        DELETE_LOADING: 'Đang xóa...',
        STATUS: 'Đổi trạng thái',
        STATUS_LOADING: 'Đang đổi trạng thái...',
        SAVE_LOADING: 'Đang lưu...',
      },
      EMPTY: 'Chưa có cấu hình KPI nào.',
      SECTION_TITLE: 'Quản trị cấu hình KPI',
      SECTION_SUBTITLE: 'Chuẩn hóa luồng Add/Edit/Delete/Đổi trạng thái theo pattern dùng chung.',
    },
  },
} as const

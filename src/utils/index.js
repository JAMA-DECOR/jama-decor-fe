import moment from "moment/moment";
import { roles } from "../constants/app";
import routes from "../constants/routes";
import dayjs from "dayjs";
import { orderLabels } from "../constants/enum";
import { ETaskMap, wTaskMap } from "../constants/enum";

export const formatDate = (date, pattern, defaultValue) => {
  let result = "";
  if (date) {
    result = moment(date).format(pattern);
  }
  return defaultValue ?? result;
};

export const getTitle = (route) => {
  switch (route) {
    case routes.dashboard.home:
      return "Bảng điều khiển";
    case routes.dashboard.profile:
      return "Thông tin cá nhân";
    case routes.dashboard.statistics:
      return "Thống kê";
    default:
      return "";
  }
};

export const getRoleName = (role) => {
  switch (role) {
    case roles.ADMIN:
      return "Quản trị viên";
    case roles.FOREMAN:
      return "Quản đốc";
    case roles.LEADER:
      return "Tổ trưởng";
    case roles.WORKER:
      return "Công nhân";
    default:
      return "";
  }
};

export const getStatusName = (status) => {
  return orderLabels[status];
};

// Number processing
const shrinkSuffix = ["", "K", "M", "G", "T"];
export const reduceNumber = (num) => {
  if (num && num > 999) {
    let count = 0;
    while (num > 999) {
      count++;
      num /= 1000;
    }
    return num + shrinkSuffix[count];
    // switch (count) {
    // 	case 1:
    // 		return num + 'K'
    // 	case 2:
    // 		return num + 'M'
    // 	case 3:
    // 		return num + 'G'
    // }
  }
  return num;
};

export const formatNum = (value) => {
  return (value || 0) * 1;
};

export const dateSort = (dateA, dateB) => {
  return dayjs(dateA).isAfter(dayjs(dateB)) ? 1 : dayjs(dateA).isBefore(dayjs(dateB)) ? -1 : 0;
};

export const formatMoney = (money) => {
  if (!money) money = 0;
  return money.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
}

export const getTaskStatusName = (status) => {
  return ETaskMap[status]?.label || "Không Xác Định";
};

export const getTaskStatusColor = (status) => {
  return ETaskMap[status]?.color || "#FF0000";
};

export const getWTaskStatusName = (status) => {
  return wTaskMap[status]?.label || "Không Xác Định";
};

export const getWTaskStatusColor = (status) => {
  return wTaskMap[status]?.color || "#FF0000";
};

export const handleDownloadFile = async (url, filename, message) => {
  if (!url) message.warning("Không có bản vẽ");
  try {
    var fileName = formatDate(new Date(), "DDMMYYYYHHmmss") + "_" + filename + ".png";
    var downloadFile = new Blob([url], { type: "image/jpeg (.jpg, .jpeg, .jfif, .pjpeg, .pjp)" });
    var fileURL = window.URL.createObjectURL(downloadFile);
    var a = document.createElement("a");
    a.download = fileName;
    a.href = fileURL;
    a.click();
  } catch (err) {
    console.log(err);
  }
}

const range = (start, end) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

export const disabledDateTime = () => ({
  disabledHours: () => range(0, dayjs().hour()),
});

export const handleRetrieveWorkerOnTask = (members) => {
  if (!members) return [];
  return members?.map((e) => {
    return {
      id: e.memberId,
      fullName: e.memberFullName
    }
  })
}
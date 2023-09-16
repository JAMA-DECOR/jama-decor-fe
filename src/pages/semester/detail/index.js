import React, { useEffect, useState } from "react";
import SemesterApi from "../../../apis/semester";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Collapse, Row, Spin, TimePicker, Typography } from "antd";
import { RawHtml } from "../../../components/RawHtml";
import moment from "moment";
import { ArrowRight } from "@icon-park/react";
const { Text, Title } = Typography;

const SemesterDetailPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [semester, setSemesters] = useState([]);
	const [classes, setClasses] = useState([]);
	const [loading, setLoading] = useState(false);

	const startTime = moment(semester.startTime);
	const endTime = moment(semester.endTime);

	const formattedStartTime = startTime.format("DD/MM/YYYY");
	const formattedEndTime = endTime.format("DD/MM/YYYY");


	const getSemester = async () => {
		setLoading(true);
		const data = await SemesterApi.getSemesterById(id);
		setSemesters(data);
		console.log("Data: ", data);
		setLoading(false);
	};

	useEffect(() => {
		getSemester();
	}, []);

	return (
		<Card
		
			title={`Học kỳ: ${semester.name}`}
		>
			<Collapse
				items={[
					{
						label: <Text> Môn {semester.name}</Text>, //tên course
						children: (
							<div>
								<div>
									<Text strong>Giáo viên hướng dẫn: </Text>
									<Text>{}</Text>
								</div>
								<div>
									<Text strong>Thời gian bắt đầu: </Text>
									<Text>{formattedStartTime}</Text>
								</div>

								<div className="mt-3">
									<Text strong>Thời gian kết thúc: </Text>
									<Text>{formattedEndTime}</Text>
								</div>
							</div>
						),
					},
				]}
			/>
		</Card>
	);
};

export default SemesterDetailPage;

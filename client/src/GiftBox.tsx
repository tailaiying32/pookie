import { useState } from "react";
import "./styles/GiftBox.css";

function GiftBox() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="container cursor-pointer">
			<div className="row">
				<div className="col-12"></div>
				<div className="col-12 mt-5 d-flex justify-content-center">
					<div className="box">
						<div
							className={`box-body${isOpen ? " open" : ""}`}
							onClick={() => setIsOpen((prev) => !prev)}
						>
							<div className="box-lid">
								<div className="box-bowtie"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default GiftBox;

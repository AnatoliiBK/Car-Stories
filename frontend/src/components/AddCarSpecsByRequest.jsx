import { useLocation, useParams } from "react-router-dom";
import AddCarSpecs from "./AddCarSpecs";

export default function AddCarSpecsByRequest() {
  const location = useLocation();
  const { carId } = useParams();

  const allowed = location.state?.allowed;

  if (!allowed) {
    return <div>⛔️ У вас немає доступу до цієї сторінки.</div>;
  }

  return <AddCarSpecs carId={carId} bypassPermissions />;
}

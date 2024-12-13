
<!DOCTYPE html>
<html>
 
<body>
 
  <h1>Hello GFG </h1>
<?php
class HospitalDatabase {
    private $conn;

    public function __construct($host, $username, $password, $database) {
        // Create database connection
        $this->conn = new mysqli($host, $username, $password, $database);
        
        // Check connection
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    // CREATE Operation
    public function createHospital($name, $location, $contact_number, $email, $specializations, $total_beds, $available_beds, $hospital_type) {
        $stmt = $this->conn->prepare("INSERT INTO Hospitals 
            (name, location, contact_number, email, specializations_offered, 
            total_beds, available_beds, hospital_type) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->bind_param("sssssiis", 
            $name, $location, $contact_number, $email, $specializations, 
            $total_beds, $available_beds, $hospital_type);
        
        return $stmt->execute() ? $this->conn->insert_id : false;
    }

    // READ Operation - Get All Hospitals
    public function getAllHospitals() {
        $result = $this->conn->query("SELECT * FROM Hospitals");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // READ Operation - Get Single Hospital
    public function getHospitalById($hospital_id) {
        $stmt = $this->conn->prepare("SELECT * FROM Hospitals WHERE hospital_id = ?");
        $stmt->bind_param("i", $hospital_id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    // UPDATE Operation
    public function updateHospital($hospital_id, $name, $location, $contact_number, $email, $specializations, $total_beds, $available_beds, $hospital_type) {
        $stmt = $this->conn->prepare("UPDATE Hospitals SET 
            name = ?, location = ?, contact_number = ?, email = ?, 
            specializations_offered = ?, total_beds = ?, available_beds = ?, hospital_type = ? 
            WHERE hospital_id = ?");
        
        $stmt->bind_param("sssssiisi", 
            $name, $location, $contact_number, $email, $specializations, 
            $total_beds, $available_beds, $hospital_type, $hospital_id);
        
        return $stmt->execute();
    }

    // DELETE Operation
    public function deleteHospital($hospital_id) {
        $stmt = $this->conn->prepare("DELETE FROM Hospitals WHERE hospital_id = ?");
        $stmt->bind_param("i", $hospital_id);
        return $stmt->execute();
    }

    // Destructor to close database connection
    public function __destruct() {
        $this->conn->close();
    }
}

// Example Usage
try {
    $hospital_db = new HospitalDatabase('localhost', 'root', '', 'healthcare');

    // Create a new hospital
    $new_hospital_id = $hospital_db->createHospital(
        'City General Hospital', 
        '123 Healthcare Street', 
        '555-1234', 
        'contact@citygeneral.com', 
        'Cardiology, Neurology', 
        500, 
        250, 
        'General'
    );

    // Read all hospitals
    $all_hospitals = $hospital_db->getAllHospitals();

    // Update a hospital
    $hospital_db->updateHospital(
        $new_hospital_id, 
        'Updated City General Hospital', 
        '456 New Healthcare Avenue', 
        '555-5678', 
        'newcontact@citygeneral.com', 
        'Cardiology, Neurology, Oncology', 
        600, 
        300, 
        'Multispecialty'
    );

    // Delete a hospital
    $hospital_db->deleteHospital($new_hospital_id);

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
 
</body>
</html>

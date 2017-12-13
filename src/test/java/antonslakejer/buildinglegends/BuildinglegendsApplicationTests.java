package antonslakejer.buildinglegends;

import antonslakejer.buildinglegends.Repository.ScoreRepository;
import antonslakejer.buildinglegends.domain.Build;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class BuildinglegendsApplicationTests {

	@Test
	public void contextLoads() {
	}

	@Autowired
	ScoreRepository scoreRepository;

	@Test
	public void main() {
//		Build build = new Build("Andreas",200,"Sr",1,2,3,4,5,6);
//		scoreRepository.saveState(build);

	}


}

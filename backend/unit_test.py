import os
import unittest
from main import img_path

class TestImgPath(unittest.TestCase):
    def test_img_path(self):
        # Test case where directory starts with 'build/'
        input_directory = f'.{os.sep}build{os.sep}assets{os.sep}'
        expected_output = f'.{os.sep}assets{os.sep}'
        self.assertEqual(os.path.normpath(img_path(input_directory)), os.path.normpath(expected_output))

        # Test case where directory includes 'build/' but not at the beginning
        input_directory = f'.{os.sep}some{os.sep}path{os.sep}build{os.sep}assets{os.sep}'
        self.assertEqual(os.path.normpath(img_path(input_directory)), os.path.normpath(expected_output))

        # Test case where directory does not include 'build/'
        input_directory = f'.{os.sep}assets{os.sep}img{os.sep}whatever.jpg'
        expected_output = f'.{os.sep}assets{os.sep}img{os.sep}whatever.jpg'
        self.assertEqual(os.path.normpath(img_path(input_directory)), os.path.normpath(expected_output))

class TestCartget(unittest.TestCase):
    def test_cart_get(self):
        user_id = 1
        expected_cart = {}
        self.assertEqual()
if __name__ == '__main__':
    unittest.main()

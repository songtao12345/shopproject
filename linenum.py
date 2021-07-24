
import argparse

def cal(file_types):
    import os

    def is_target_file(file_path, file_types):
        flag = False
        for type_name in file_types:
            if os.path.splitext(file_path)[1] == "."+type_name:
                flag = True
                break

        return flag

    def all_files(path, list_name, file_types):
        for file in os.listdir(path):
            file_path = os.path.join(path, file)
            if os.path.isdir(file_path):
                all_files(file_path, list_name, file_types)
            elif is_target_file(file_path, file_types):
                list_name.append(file_path)

    file_lists = list()
    all_files(".", file_lists, file_types)
    cnt = 0
    for file in file_lists:
        with open(file, "r", encoding="utf-8") as f:
            cnt += len(f.readlines())

    print("总代码文件数为："+str(len(file_lists)))
    print("代码总行数为："+str(cnt))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--type", default="py,sql,html")
    args = parser.parse_args()

    cal(args.type.split(","))